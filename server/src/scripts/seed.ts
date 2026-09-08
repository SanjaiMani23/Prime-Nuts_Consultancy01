import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import { seedProducts } from '../data/seedProducts';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI provided in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding.');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    const sanitizedProducts = seedProducts.map((p: any) => {
      const { id, ...rest } = p;
      return rest;
    });

    await Product.insertMany(sanitizedProducts);
    console.log(`Migrated ${seedProducts.length} products.`);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
