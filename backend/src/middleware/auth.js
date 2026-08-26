import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpError } from '../utils/http.js';

export function auth(req, _res, next) {
  try { req.user = jwt.verify(req.cookies.coopera_session, config.jwtSecret); next(); }
  catch { next(new HttpError(401, 'Entre na sua conta para continuar.')); }
}
export function admin(req, _res, next) {
  if (!['admin', 'moderator'].includes(req.user?.role)) return next(new HttpError(403, 'Acesso restrito.'));
  next();
}
