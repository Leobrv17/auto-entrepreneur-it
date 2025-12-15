import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import { connectMongo } from './config/mongo.js';

dotenv.config();

const port = process.env.PORT || 4000;

connectMongo().then(() => {
  app.listen(port, () => {
    console.log(`API server ready on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

// close connection gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
