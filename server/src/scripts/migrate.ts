import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Product from '../models/Product';
import Offer from '../models/Offer';
import Review from '../models/Review';

dotenv.config();

const STORE_FILE = path.join(__dirname, '../data/store.json');

const migrateData = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI provided in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for migration.');

    if (!fs.existsSync(STORE_FILE)) {
      console.error(`Store file not found at ${STORE_FILE}`);
      process.exit(1);
    }

    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const cleanRaw = raw.replace(/^\uFEFF/, '');
    const data = JSON.parse(cleanRaw);

    const products = data.products || [];
    const offers = data.offers || [];
    const reviews = data.reviews || [];

    // Clear existing data (optional, but good for a fresh migration)
    await Product.deleteMany({});
    await Offer.deleteMany({});
    await Review.deleteMany({});

    if (products.length > 0) {
      // Remove any 'id' fields from products to let Mongoose generate _id
      // Or map them if they need to be preserved (we'll just let Mongoose generate them if they don't map to _id)
      const sanitizedProducts = products.map((p: any) => {
        const { id, ...rest } = p;
        return rest;
      });
      await Product.insertMany(sanitizedProducts);
      console.log(`Migrated ${products.length} products.`);
    }

    if (offers.length > 0) {
      const sanitizedOffers = offers.map((o: any) => {
        const { id, ...rest } = o;
        return rest;
      });
      await Offer.insertMany(sanitizedOffers);
      console.log(`Migrated ${offers.length} offers.`);
    }

    if (reviews.length > 0) {
      const sanitizedReviews = reviews.map((r: any) => {
        const { id, ...rest } = r;
        return rest;
      });
      await Review.insertMany(sanitizedReviews);
      console.log(`Migrated ${reviews.length} reviews.`);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
