import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from '../config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../migrations');
const db = await mysql.createConnection({ ...config.mysql, multipleStatements: true });
await db.query('CREATE TABLE IF NOT EXISTS migrations (name VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
const [rows] = await db.query('SELECT name FROM migrations');
const done = new Set(rows.map((row) => row.name));
for (const name of (await fs.readdir(root)).filter((x) => x.endsWith('.sql')).sort()) {
  if (done.has(name)) continue;
  const sql = await fs.readFile(path.join(root, name), 'utf8');
  await db.beginTransaction();
  try { await db.query(sql); await db.query('INSERT INTO migrations(name) VALUES (?)', [name]); await db.commit(); console.log(`Applied ${name}`); }
  catch (error) { await db.rollback(); throw error; }
}
await db.end();
