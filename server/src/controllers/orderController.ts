import { Request, Response } from 'express';
import { memoryStore, saveStoreToFile } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { Order, OrderStatus } from '../types';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      couponCode,
      total,
      notes,
      guestCustomer,
    } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      res.status(400).json({ success: false, message: 'Items and shipping address are required.' });
      return;
    }

    const orderNumber = `TPN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      userId: req.user?.id,
      guestCustomer: !req.user ? guestCustomer : undefined,
      items,
      shippingAddress,
      deliveryMethod: deliveryMethod || 'Free Tamil Nadu Delivery',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'UPI / Online' ? 'Paid' : paymentMethod === 'Direct WhatsApp Order' ? 'WhatsApp Verified' : 'Pending',
      orderStatus: 'Placed',
      subtotal: subtotal || items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0),
      deliveryFee: deliveryFee || 0,
      discount: discount || 0,
      couponCode,
      total: total || subtotal,
      notes,
      timeline: [
        {
          status: 'Placed',
          timestamp: new Date().toISOString(),
          note: `Order placed successfully via ${paymentMethod || 'Online Store'}. Free Tamil Nadu Delivery applied.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.orders.unshift(newOrder);
    saveStoreToFile();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! We are preparing your fresh nuts.',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const orders = memoryStore.orders
      .filter(o => o.userId === req.user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = memoryStore.orders.find(o => o.id === id || o.orderNumber === id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Allow user if admin, owner, or guest order lookup by order number
    if (req.user && req.user.role !== 'admin' && order.userId && order.userId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized access to this order.' });
      return;
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order' });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let orders = [...memoryStore.orders];

    if (status && typeof status === 'string' && status !== 'All') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note, paymentStatus } = req.body;

    const index = memoryStore.orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const order = memoryStore.orders[index];

    if (status && status !== order.orderStatus) {
      order.orderStatus = status as OrderStatus;
      order.timeline.push({
        status: status as OrderStatus,
        timestamp: new Date().toISOString(),
        note: note || `Order marked as ${status}`,
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    order.updatedAt = new Date().toISOString();
    memoryStore.orders[index] = order;
    saveStoreToFile();

    res.json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};
