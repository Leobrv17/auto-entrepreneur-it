import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/auto_entrepreneur';

export const connectMongo = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB || undefined,
  });
  console.log('Connected to MongoDB');
};

export default mongoose;
