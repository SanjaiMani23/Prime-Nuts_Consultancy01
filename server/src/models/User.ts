import mongoose, { Schema, Document } from 'mongoose';
import { User, Address } from '../types';

export interface IUser extends Omit<User, 'id'>, Document {}

const addressSchema = new Schema({
  id: { type: String },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  is_active: { type: Boolean, default: true },
  email_verified: { type: Boolean, default: false },
  addresses: [addressSchema],
  wishlist: [{ type: String }],
  createdAt: { type: String, required: true },
  updatedAt: { type: String },
  last_login_at: { type: String },
  reset_password_token: { type: String },
  reset_password_expires: { type: String }
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password_hash;
    return ret;
  }
});

export default mongoose.model<IUser>('User', userSchema);
