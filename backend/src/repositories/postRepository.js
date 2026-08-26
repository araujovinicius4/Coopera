import { pool } from '../db/pool.js';

const publicSelect = `SELECT p.id,p.type,p.title,p.description,p.modality,p.urgency,p.region,p.available_from,p.available_until,p.created_at,
 c.name category, c.slug category_slug, pp.alias_name author_alias,
 EXISTS(SELECT 1 FROM verifications v WHERE v.user_id=p.user_id AND v.kind='identity' AND v.status='verified') identity_verified
 FROM posts p JOIN categories c ON c.id=p.category_id JOIN public_profiles pp ON pp.user_id=p.user_id`;

export async function listPosts({ type, category, q, limit = 24 }, userId) {
  const where = ["p.status='open'", `NOT EXISTS(SELECT 1 FROM blocks b WHERE b.blocker_id=? AND b.blocked_id=p.user_id)`];
  const values = [userId || ''];
  if (type) { where.push('p.type=?'); values.push(type); }
  if (category) { where.push('c.slug=?'); values.push(category); }
  if (q) { where.push('(p.title LIKE ? OR p.description LIKE ?)'); values.push(`%${q}%`, `%${q}%`); }
  values.push(Number(limit));
  const [rows] = await pool.query(`${publicSelect} WHERE ${where.join(' AND ')} ORDER BY FIELD(p.urgency,'high','medium','low'),p.created_at DESC LIMIT ?`, values);
  return rows;
}
export async function findPost(id) { const [rows] = await pool.query(`${publicSelect} WHERE p.id=?`, [id]); return rows[0]; }
export async function createPost(post) {
  await pool.query(`INSERT INTO posts(id,user_id,category_id,type,title,description,modality,urgency,region,available_from,available_until)
    SELECT ?,?,id,?,?,?,?,?,?,?,? FROM categories WHERE slug=?`, [post.id,post.userId,post.type,post.title,post.description,post.modality,post.urgency,post.region,post.availableFrom||null,post.availableUntil||null,post.category]);
  return findPost(post.id);
}
