import mongoose from '../config/mongo.js';

const accessSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

accessSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const Access = mongoose.model('Access', accessSchema);
export default Access;
