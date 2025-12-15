import mongoose from '../config/mongo.js';

const historySchema = new mongoose.Schema({
  action: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date, default: Date.now },
}, { _id: false });

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  labels: [{ type: String }],
  dueDate: { type: Date },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [historySchema],
}, { timestamps: true });

taskSchema.index({ projectId: 1, columnId: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
