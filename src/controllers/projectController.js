import Project from '../models/Project.js';
import Access from '../models/Access.js';
import { getPagination } from '../utils/pagination.js';

const userProjectFilter = async (user) => {
  if (user.role === 'admin') return {};
  const access = await Access.find({ userId: user._id }).select('projectId');
  const ids = access.map((a) => a.projectId);
  return { _id: { $in: ids } };
};

export const listProjects = async (req, res, next) => {
  try {
    const filter = await userProjectFilter(req.user);
    const { limit, skip, page } = getPagination(req);
    const [items, total] = await Promise.all([
      Project.find(filter).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);
    return res.json({ items, page, total });
  } catch (err) { return next(err); }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(project);
  } catch (err) { return next(err); }
};

export const getProject = async (req, res, next) => {
  try {
    const filter = await userProjectFilter(req.user);
    const project = await Project.findOne({ ...filter, _id: req.params.id });
    if (!project) return res.status(404).json({ code: 'NOT_FOUND', message: 'Project not found' });
    return res.json(project);
  } catch (err) { return next(err); }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ code: 'NOT_FOUND', message: 'Project not found' });
    return res.json(project);
  } catch (err) { return next(err); }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ code: 'NOT_FOUND', message: 'Project not found' });
    await Access.deleteMany({ projectId: req.params.id });
    return res.json({ message: 'Deleted' });
  } catch (err) { return next(err); }
};

export const grantAccess = async (req, res, next) => {
  try {
    const access = await Access.create({ projectId: req.params.id, userId: req.body.userId });
    return res.status(201).json(access);
  } catch (err) { return next(err); }
};

export const revokeAccess = async (req, res, next) => {
  try {
    await Access.deleteOne({ projectId: req.params.id, userId: req.body.userId });
    return res.json({ message: 'Access revoked' });
  } catch (err) { return next(err); }
};
