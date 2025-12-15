import mongoose from '../config/mongo.js';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'draft' },
  clientIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
