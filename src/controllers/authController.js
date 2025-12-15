import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jwtConfig } from '../config/jwt.js';
import tokenService from '../services/tokenService.js';

const signToken = (user) => jwt.sign({ sub: user._id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

export const register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ code: 'EMAIL_EXISTS', message: 'Email already registered' });
    }
    const user = await User.create(req.body);
    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' });
    const match = await user.comparePassword(req.body.password);
    if (!match) return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({ token, user });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
  if (token) tokenService.revoke(token);
  return res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
