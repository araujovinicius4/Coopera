import { randomUUID } from 'node:crypto';
import { createPost, findPost, listPosts } from '../repositories/postRepository.js';
import { rankMatches } from '../services/matchingService.js';
import { HttpError } from '../utils/http.js';
export async function index(req,res){ res.json({posts:await listPosts(req.query,req.user?.id)}); }
export async function create(req,res){ const post=await createPost({id:randomUUID(),userId:req.user.id,...req.validated}); if(!post) throw new HttpError(400,'Categoria inválida.'); res.status(201).json({post}); }
export async function matches(req,res){ const source=await findPost(req.params.id); if(!source) throw new HttpError(404,'Publicação não encontrada.'); const candidates=await listPosts({type:source.type==='need'?'offer':'need',category:source.category_slug,limit:50},req.user.id); res.json({matches:rankMatches(source,candidates)}); }
