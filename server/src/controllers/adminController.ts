import { Request, Response } from 'express';
import { AdminStats } from '../types';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Offer from '../models/Offer';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => {
      if (o.orderStatus !== 'Cancelled') return sum + o.total;
      return sum;
    }, 0);

    const totalOrders = orders.length;
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pendingOrders = orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Confirmed').length;

    // Check low stock variants (stock < 50)
    const products = await Product.find({}, 'variants');
    let lowStockCount = 0;
    products.forEach(p => {
      if (p.variants.some(v => v.stock < 50)) {
        lowStockCount++;
      }
    });

    // Recent 5 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Top selling products computation
    const productSalesMap: { [id: string]: { name: string; salesCount: number; revenue: number } } = {};
    orders.forEach(order => {
      if (order.orderStatus === 'Cancelled') return;
      order.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.productName,
            salesCount: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.productId].salesCount += item.quantity;
        productSalesMap[item.productId].revenue += item.total;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const stats: AdminStats = {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockCount,
      recentOrders: recentOrders as any,
      topProducts,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error computing admin statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to compute admin statistics' });
  }
};

export const getCustomers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: 'customer' });
    
    // We could use aggregation, but since this is migrating a small script:
    const customers = await Promise.all(users.map(async u => {
      const customerOrders = await Order.find({ userId: u._id });
      const totalSpent = customerOrders.reduce((sum, o) => {
        return o.orderStatus !== 'Cancelled' ? sum + o.total : sum;
      }, 0);
      
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        addressCount: u.addresses.length,
        ordersCount: customerOrders.length,
        totalSpent,
        joinedDate: u.createdAt,
      };
    }));

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

export const getOffers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch offers' });
  }
};

export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, tamilTitle, code, discountPercent, minOrderValue, description, bannerImage, linkedProductIds, validFrom, validUntil, isActive, isBanner } = req.body;

    if (!title || !code) {
      res.status(400).json({ success: false, message: 'Title and code are required' });
      return;
    }

    const offerData = {
      title,
      tamilTitle: tamilTitle || '',
      code,
      discountPercent: discountPercent || 0,
      minOrderValue: minOrderValue || 0,
      description: description || '',
      bannerImage: bannerImage || '',
      linkedProductIds: linkedProductIds || [],
      validFrom: validFrom || new Date().toISOString().split('T')[0],
      validUntil: validUntil || '2026-12-31',
      isActive: isActive !== undefined ? isActive : true,
      isBanner: isBanner || false,
    };

    const newOffer = new Offer(offerData);
    await newOffer.save();

    res.status(201).json({ success: true, offer: newOffer, message: 'Offer created successfully' });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ success: false, message: 'Failed to create offer' });
  }
};

export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { code: id };

    const updatedOffer = await Offer.findOneAndUpdate(query, { $set: req.body }, { new: true });

    if (!updatedOffer) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    res.json({ success: true, offer: updatedOffer, message: 'Offer updated successfully' });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ success: false, message: 'Failed to update offer' });
  }
};

export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { code: id };

    const deleted = await Offer.findOneAndDelete(query);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ success: false, message: 'Failed to delete offer' });
  }
};
