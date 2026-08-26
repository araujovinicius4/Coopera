import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { config } from '../config.js';
import { HttpError } from '../utils/http.js';

const cookie = { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', maxAge:7*86400000 };
export async function register(req,res) {
  const { email,password,name,region } = req.validated; const id=randomUUID();
  const conn=await pool.getConnection();
  try { await conn.beginTransaction(); const hash=await bcrypt.hash(password,12); await conn.query('INSERT INTO users(id,email,password_hash) VALUES (?,?,?)',[id,email.toLowerCase(),hash]); await conn.query('INSERT INTO private_identities(user_id,full_name) VALUES (?,?)',[id,name]); await conn.query('INSERT INTO public_profiles(user_id,alias_name,region) VALUES (?,?,?)',[id,'Pessoa da comunidade',region]); await conn.commit(); }
  catch(error){ await conn.rollback(); if(error.code==='ER_DUP_ENTRY') throw new HttpError(409,'Este e-mail já está cadastrado.'); throw error; } finally { conn.release(); }
  res.cookie('coopera_session',jwt.sign({id,role:'user'},config.jwtSecret,{expiresIn:'7d'}),cookie).status(201).json({user:{id,alias:'Pessoa da comunidade',role:'user'}});
}
export async function login(req,res) {
  const [rows]=await pool.query(`SELECT u.id,u.password_hash,u.role,u.status,p.alias_name FROM users u JOIN public_profiles p ON p.user_id=u.id WHERE u.email=?`,[req.validated.email.toLowerCase()]); const user=rows[0];
  if(!user||user.status!=='active'||!(await bcrypt.compare(req.validated.password,user.password_hash))) throw new HttpError(401,'E-mail ou senha incorretos.');
  res.cookie('coopera_session',jwt.sign({id:user.id,role:user.role},config.jwtSecret,{expiresIn:'7d'}),cookie).json({user:{id:user.id,alias:user.alias_name,role:user.role}});
}
export async function me(req,res){ const [rows]=await pool.query('SELECT u.id,u.role,p.alias_name alias,p.region FROM users u JOIN public_profiles p ON p.user_id=u.id WHERE u.id=?',[req.user.id]); res.json({user:rows[0]}); }
export function logout(_req,res){ res.clearCookie('coopera_session',cookie).status(204).end(); }
