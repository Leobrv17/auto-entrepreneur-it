import Column from '../models/Column.js';
import Task from '../models/Task.js';
import Access from '../models/Access.js';
import Project from '../models/Project.js';
import kanbanService from '../services/kanbanService.js';

const ensureAuthorized = async (user, projectId) => {
  if (user.role === 'admin') return true;
  const access = await Access.findOne({ userId: user._id, projectId });
  return !!access;
};

export const getBoard = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ code: 'NOT_FOUND', message: 'Project not found' });
    const authorized = await ensureAuthorized(req.user, req.params.id);
    if (!authorized) return res.status(403).json({ code: 'FORBIDDEN', message: 'Access denied' });
    await kanbanService.ensureDefaultColumns(project._id);
    const [columns, tasks] = await Promise.all([
      Column.find({ projectId: project._id }).sort({ order: 1 }),
      Task.find({ projectId: project._id }),
    ]);
    return res.json({ project, columns, tasks });
  } catch (err) { return next(err); }
};

export const createColumn = async (req, res, next) => {
  try {
    const column = await Column.create({ ...req.body, projectId: req.params.id });
    return res.status(201).json(column);
  } catch (err) { return next(err); }
};

export const updateColumn = async (req, res, next) => {
  try {
    const column = await Column.findOneAndUpdate({ _id: req.params.colId, projectId: req.params.id }, req.body, { new: true });
    if (!column) return res.status(404).json({ code: 'NOT_FOUND', message: 'Column not found' });
    return res.json(column);
  } catch (err) { return next(err); }
};

export const createTask = async (req, res, next) => {
  try {
    const columnId = req.body.columnId || req.body.colId || req.params.colId;
    const task = await Task.create({ ...req.body, projectId: req.params.id, columnId });
    task.history.push({ action: 'Created task', userId: req.user._id });
    await task.save();
    return res.status(201).json(task);
  } catch (err) { return next(err); }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.taskId, projectId: req.params.id }, req.body, { new: true });
    if (!task) return res.status(404).json({ code: 'NOT_FOUND', message: 'Task not found' });
    task.history.push({ action: 'Updated task', userId: req.user._id });
    await task.save();
    return res.json(task);
  } catch (err) { return next(err); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, projectId: req.params.id });
    if (!task) return res.status(404).json({ code: 'NOT_FOUND', message: 'Task not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) { return next(err); }
};

export const moveTask = async (req, res, next) => {
  try {
    const moved = await kanbanService.moveTask(req.params.taskId, req.body.toColumnId, req.user._id);
    if (!moved) return res.status(404).json({ code: 'NOT_FOUND', message: 'Task not found' });
    return res.json(moved);
  } catch (err) { return next(err); }
};
