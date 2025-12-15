import dotenv from 'dotenv';
import mongoose, { connectMongo } from '../src/config/mongo.js';
import User from '../src/models/User.js';

dotenv.config();

const run = async () => {
  await connectMongo();
  await mongoose.connection.dropDatabase();
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });
  console.log(`Seeded admin ${adminEmail}/${adminPassword}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
