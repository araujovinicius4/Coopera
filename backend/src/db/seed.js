import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const categories = [['Objetos e ferramentas','objetos'],['Transporte','transporte'],['Conhecimento','conhecimento'],['Serviços e tarefas','servicos'],['Cuidado e companhia','cuidado'],['Alimentos','alimentos'],['Meio ambiente','ambiente']];
for (const item of categories) await pool.query('INSERT IGNORE INTO categories(name,slug) VALUES (?,?)', item);
const id = randomUUID();
const hash = await bcrypt.hash('CooperaAdmin123!', 12);
await pool.query("INSERT IGNORE INTO users(id,email,password_hash,role) VALUES (?,?,?,'admin')", [id, 'admin@coopera.local', hash]);
const [[admin]] = await pool.query('SELECT id FROM users WHERE email=?', ['admin@coopera.local']);
await pool.query("INSERT IGNORE INTO private_identities(user_id,full_name) VALUES (?,'Administração Coopera')", [admin.id]);
await pool.query("INSERT IGNORE INTO public_profiles(user_id,alias_name,region) VALUES (?,'Equipe Coopera','Fortaleza')", [admin.id]);
const [[count]] = await pool.query('SELECT COUNT(*) total FROM transparency_updates');
if (!count.total) await pool.query("INSERT INTO transparency_updates(id,kind,title,description,status,occurred_on) VALUES (?,'milestone','MVP em desenvolvimento','A arquitetura inicial, a experiência pública e os recursos essenciais estão em construção.','em andamento',CURRENT_DATE)", [randomUUID()]);
console.log('Seed concluído.');
await pool.end();
