import { HttpError } from '../utils/http.js';
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(new HttpError(400, result.error.issues[0]?.message || 'Dados inválidos.'));
  req.validated = result.data; next();
};
