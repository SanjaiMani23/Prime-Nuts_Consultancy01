import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../types';

export interface IProduct extends Omit<Product, 'id'>, Document {}

const weightVariantSchema = new Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, required: true },
  sku: { type: String, required: true }
}, { _id: false });

const productSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tamilName: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: ['Nuts', 'Dried Fruits', 'Seeds', 'Combos', 'Gift Packs', 'Snacks']
  },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  quote: { type: String },
  images: [{ type: String }],
  variants: [weightVariantSchema],
  defaultWeight: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  badges: [{ 
    type: String,
    enum: ['Best Seller', 'New', 'Combo Offer', 'Limited Offer', 'Best Value', 'Festival Special']
  }],
  ingredients: [{ type: String }],
  storage: { type: String },
  origin: { type: String },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });

productSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IProduct>('Product', productSchema);
