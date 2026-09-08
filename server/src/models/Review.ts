import mongoose, { Schema, Document } from 'mongoose';
import { Review } from '../types';

export interface IReview extends Omit<Review, 'id'>, Document {}

const reviewSchema = new Schema({
  productId: { type: String, required: true },
  userName: { type: String, required: true },
  userCity: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: false },
  createdAt: { type: String, required: true }
}, { timestamps: true });

reviewSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IReview>('Review', reviewSchema);
