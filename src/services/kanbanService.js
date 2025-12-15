import Column from '../models/Column.js';
import Task from '../models/Task.js';

const defaultColumns = ['To Do', 'In Progress', 'Done'];

const kanbanService = {
  async ensureDefaultColumns(projectId) {
    const count = await Column.countDocuments({ projectId });
    if (count === 0) {
      await Column.insertMany(defaultColumns.map((title, index) => ({ projectId, title, order: index })));
    }
  },
  async moveTask(taskId, toColumnId, userId) {
    const task = await Task.findById(taskId);
    if (!task) return null;
    task.columnId = toColumnId;
    task.history.push({ action: `Moved to column ${toColumnId}`, userId });
    await task.save();
    return task;
  },
};

export default kanbanService;
