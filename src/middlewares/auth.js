import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import User from '../models/User.js';
import tokenService from '../services/tokenService.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
  if (!token) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing token' });
  }

  if (tokenService.isRevoked(token)) {
    return res.status(401).json({ code: 'TOKEN_REVOKED', message: 'Session expired' });
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid token' });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ code: 'FORBIDDEN', message: 'Admin only' });
  }
  return next();
};

export default auth;
