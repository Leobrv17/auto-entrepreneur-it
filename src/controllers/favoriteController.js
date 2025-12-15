import Favorite from '../models/Favorite.js';
import { getPagination } from '../utils/pagination.js';

export const listFavorites = async (req, res, next) => {
  try {
    const { limit, skip, page } = getPagination(req);
    const [items, total] = await Promise.all([
      Favorite.find({ userId: req.user._id }).skip(skip).limit(limit),
      Favorite.countDocuments({ userId: req.user._id }),
    ]);
    return res.json({ items, page, total });
  } catch (err) { return next(err); }
};

export const createFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.create({ ...req.body, userId: req.user._id });
    return res.status(201).json(favorite);
  } catch (err) { return next(err); }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    await Favorite.deleteOne({ _id: req.params.favId, userId: req.user._id });
    return res.json({ message: 'Deleted' });
  } catch (err) { return next(err); }
};
