import mongoose, { Schema, Document } from 'mongoose';
import { Order, OrderItem, OrderTimeline, Address } from '../types';

export interface IOrder extends Omit<Order, 'id'>, Document {}

const orderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productSlug: { type: String, required: true },
  image: { type: String, required: true },
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

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

const orderTimelineSchema = new Schema({
  status: { 
    type: String, 
    required: true,
    enum: ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  timestamp: { type: String, required: true },
  note: { type: String }
}, { _id: false });

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String }, // Can be null for guest checkout
  guestCustomer: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  items: [orderItemSchema],
  shippingAddress: { type: addressSchema, required: true },
  deliveryMethod: { 
    type: String, 
    required: true,
    enum: ['Free Tamil Nadu Delivery', 'Store Pickup (Sundarapuram)']
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['UPI / Online', 'Cash on Delivery', 'Direct WhatsApp Order']
  },
  paymentStatus: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Paid', 'Cash on Delivery', 'WhatsApp Verified']
  },
  orderStatus: { 
    type: String, 
    required: true,
    enum: ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  discount: { type: Number, required: true, default: 0 },
  couponCode: { type: String },
  total: { type: Number, required: true },
  notes: { type: String },
  timeline: [orderTimelineSchema],
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, { timestamps: true });

orderSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IOrder>('Order', orderSchema);
