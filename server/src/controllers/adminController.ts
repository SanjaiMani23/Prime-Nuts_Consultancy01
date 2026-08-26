import { Request, Response } from 'express';
import { memoryStore, saveStoreToFile } from '../config/db';
import { AdminStats } from '../types';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalRevenue = memoryStore.orders.reduce((sum, o) => {
      if (o.orderStatus !== 'Cancelled') return sum + o.total;
      return sum;
    }, 0);

    const totalOrders = memoryStore.orders.length;
    const totalProducts = memoryStore.products.length;
    const totalCustomers = memoryStore.users.filter(u => u.role === 'customer').length;
    const pendingOrders = memoryStore.orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Confirmed').length;

    // Check low stock variants (stock < 50)
    let lowStockCount = 0;
    memoryStore.products.forEach(p => {
      if (p.variants.some(v => v.stock < 50)) {
        lowStockCount++;
      }
    });

    // Recent 5 orders
    const recentOrders = memoryStore.orders.slice(0, 5);

    // Top selling products computation
    const productSalesMap: { [id: string]: { name: string; salesCount: number; revenue: number } } = {};
    memoryStore.orders.forEach(order => {
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
      recentOrders,
      topProducts,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to compute admin statistics' });
  }
};

export const getCustomers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = memoryStore.users
      .filter(u => u.role === 'customer')
      .map(u => {
        const customerOrders = memoryStore.orders.filter(o => o.userId === u.id);
        const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          addressCount: u.addresses.length,
          ordersCount: customerOrders.length,
          totalSpent,
          joinedDate: u.createdAt,
        };
      });

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

export const getOffers = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      offers: memoryStore.offers,
    });
  } catch (error) {
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

    const newOffer = {
      id: `off-${Date.now()}`,
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

    memoryStore.offers.push(newOffer);
    saveStoreToFile();

    res.status(201).json({ success: true, offer: newOffer, message: 'Offer created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create offer' });
  }
};

export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = memoryStore.offers.findIndex(o => o.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    const updatedOffer = { ...memoryStore.offers[index], ...req.body, id };
    memoryStore.offers[index] = updatedOffer;
    saveStoreToFile();

    res.json({ success: true, offer: updatedOffer, message: 'Offer updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update offer' });
  }
};

export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = memoryStore.offers.findIndex(o => o.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    memoryStore.offers.splice(index, 1);
    saveStoreToFile();

    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete offer' });
  }
};
