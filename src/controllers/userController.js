import User from '../models/User.js';
import { getPagination } from '../utils/pagination.js';

export const listUsers = async (req, res, next) => {
  try {
    const { limit, skip, page } = getPagination(req);
    const [items, total] = await Promise.all([
      User.find().skip(skip).limit(limit).select('-password'),
      User.countDocuments(),
    ]);
    return res.json({ items, page, total });
  } catch (err) {
    return next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};
