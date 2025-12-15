import Task from '../models/Task.js';

export const batchSync = async (req, res, next) => {
  const results = [];
  try {
    for (const op of req.body.operations || []) {
      if (op.type === 'createTask') {
        const created = await Task.create({
          projectId: op.payload.projectId,
          columnId: op.payload.columnId,
          title: op.payload.title,
          description: op.payload.description,
        });
        results.push({ idempotencyKey: op.idempotencyKey, status: 'success', task: created });
      } else if (op.type === 'updateTask') {
        const updated = await Task.findByIdAndUpdate(op.payload.id, op.payload.data, { new: true });
        if (updated) {
          results.push({ idempotencyKey: op.idempotencyKey, status: 'success', task: updated });
        } else {
          results.push({ idempotencyKey: op.idempotencyKey, status: 'error', message: 'Task not found' });
        }
      } else {
        results.push({ idempotencyKey: op.idempotencyKey, status: 'error', message: 'Unknown op' });
      }
    }
    return res.json({ results });
  } catch (err) { return next(err); }
};
