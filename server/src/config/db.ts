import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('No MONGODB_URI provided in environment variables.');
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected successfully to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection failed.', error);
    process.exit(1);
  }
};
