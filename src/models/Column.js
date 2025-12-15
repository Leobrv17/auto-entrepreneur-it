import mongoose from '../config/mongo.js';

const columnSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

columnSchema.index({ projectId: 1, order: 1 });

const Column = mongoose.model('Column', columnSchema);
export default Column;
