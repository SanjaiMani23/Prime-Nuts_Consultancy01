import mongoose, { Schema, Document } from 'mongoose';
import { Offer } from '../types';

export interface IOffer extends Omit<Offer, 'id'>, Document {}

const offerSchema = new Schema({
  title: { type: String, required: true },
  tamilTitle: { type: String },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  minOrderValue: { type: Number, required: true },
  description: { type: String, required: true },
  bannerImage: { type: String },
  linkedProductIds: [{ type: String }],
  validFrom: { type: String },
  validUntil: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isBanner: { type: Boolean, default: false }
}, { timestamps: true });

offerSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IOffer>('Offer', offerSchema);
