import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Product, Order, Review, Offer } from '../types';
import { seedProducts } from '../data/seedProducts';

export interface DataStore {
  users: User[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  offers: Offer[];
}

const STORE_FILE = path.join(__dirname, '../data/store.json');

// Memory store fallback
export const memoryStore: DataStore = {
  users: [],
  products: [],
  orders: [],
  reviews: [],
  offers: [],
};

export const loadStoreFromFile = (): void => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      memoryStore.users = (data.users || []).map((u: any) => ({
        ...u,
        password_hash: u.password_hash || u.password || '',
        is_active: u.is_active !== undefined ? u.is_active : true,
        email_verified: u.email_verified !== undefined ? u.email_verified : (u.role === 'admin'),
        addresses: u.addresses || [],
        wishlist: u.wishlist || [],
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: u.updatedAt || u.createdAt || new Date().toISOString(),
      }));
      memoryStore.products = data.products || [];
      memoryStore.orders = data.orders || [];
      memoryStore.reviews = data.reviews || [];
      memoryStore.offers = data.offers || [];
    } else {
      seedInitialStore();
    }
  } catch (error) {
    console.warn('Failed reading store.json, re-initializing store:', error);
    seedInitialStore();
  }
};

export const saveStoreToFile = (): void => {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving store to file:', error);
  }
};

export const seedInitialStore = (): void => {
  // Hash passwords with salt 12 for strong baseline
  const salt = bcrypt.genSaltSync(12);
  const adminPassword = bcrypt.hashSync('Admin@123', salt);
  const customerPassword = bcrypt.hashSync('Customer@123', salt);

  memoryStore.users = [
    {
      id: 'usr-admin-01',
      name: 'The Prime Nuts Admin',
      email: 'admin@theprimenuts.com',
      phone: '+91 99946 27970',
      password_hash: adminPassword,
      role: 'admin',
      is_active: true,
      email_verified: true,
      addresses: [
        {
          id: 'addr-store-01',
          fullName: 'The Prime Nuts Store',
          phone: '+91 99946 27970',
          street: 'Opp. Abirami Hospital, Madukarai Main Road, Sundarapuram',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641024',
          isDefault: true,
        },
      ],
      wishlist: ['prod-cashew-02', 'combo-25-item-20'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr-demo-02',
      name: 'Karthik Ramanathan',
      email: 'customer@theprimenuts.com',
      phone: '+91 98765 43210',
      password_hash: customerPassword,
      role: 'customer',
      is_active: true,
      email_verified: true,
      addresses: [
        {
          id: 'addr-cbe-01',
          fullName: 'Karthik Ramanathan',
          phone: '+91 98765 43210',
          street: '14/B, Nehru Nagar East, Kalapatti Road, Aerodrome PO',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641014',
          isDefault: true,
        },
      ],
      wishlist: ['prod-almond-01', 'combo-15-in-1-21', 'gift-royal-velvet-24'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  memoryStore.products = [...seedProducts];

  memoryStore.orders = [
    {
      id: 'ord-1001',
      orderNumber: 'TPN-2026-8801',
      userId: 'usr-demo-02',
      items: [
        {
          productId: 'prod-almond-01',
          productName: 'California Almonds / Badam',
          productSlug: 'california-badam-almonds',
          image: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=900&q=80',
          weight: '500g',
          price: 460,
          quantity: 2,
          total: 920,
        },
        {
          productId: 'combo-15-in-1-21',
          productName: '15-in-1 Power Nut, Seed & Berry Daily Wellness Mix',
          productSlug: '15-in-1-power-nut-seed-daily-mix',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
          weight: '1kg Mega Value Pack',
          price: 999,
          quantity: 1,
          total: 999,
        },
      ],
      shippingAddress: {
        fullName: 'Karthik Ramanathan',
        phone: '+91 98765 43210',
        street: '14/B, Nehru Nagar East, Kalapatti Road, Aerodrome PO',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641014',
      },
      deliveryMethod: 'Free Tamil Nadu Delivery',
      paymentMethod: 'UPI / Online',
      paymentStatus: 'Paid',
      orderStatus: 'Out for Delivery',
      subtotal: 1919,
      deliveryFee: 0,
      discount: 100,
      couponCode: 'WELCOME100',
      total: 1819,
      timeline: [
        { status: 'Placed', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), note: 'Order placed online with UPI confirmation' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), note: 'Payment verified and sent for packing' },
        { status: 'Packed', timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), note: 'Airtight hygienic vacuum seal completed' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), note: 'Dispatched via Coimbatore Local Express' },
      ],
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord-1002',
      orderNumber: 'TPN-2026-8802',
      guestCustomer: {
        name: 'Meena Soundararajan',
        email: 'meena.s@gmail.com',
        phone: '+91 94432 11223',
      },
      items: [
        {
          productId: 'gift-royal-velvet-24',
          productName: 'Royal Velvet Luxury 6-Jar Gifting Hamper Box',
          productSlug: 'royal-velvet-luxury-dry-fruit-gift-hamper',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
          weight: '1.2kg Hamper (200g x 6 Jars)',
          price: 1650,
          quantity: 1,
          total: 1650,
        },
      ],
      shippingAddress: {
        fullName: 'Meena Soundararajan',
        phone: '+91 94432 11223',
        street: '42, North Usman Road, T. Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600017',
      },
      deliveryMethod: 'Free Tamil Nadu Delivery',
      paymentMethod: 'Direct WhatsApp Order',
      paymentStatus: 'WhatsApp Verified',
      orderStatus: 'Packed',
      subtotal: 1650,
      deliveryFee: 0,
      discount: 0,
      total: 1650,
      timeline: [
        { status: 'Placed', timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), note: 'Order placed via WhatsApp +91 99946 27970' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), note: 'Confirmed with store manager' },
        { status: 'Packed', timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), note: 'Packed with luxury gift ribbon' },
      ],
      createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  memoryStore.reviews = [];

  memoryStore.offers = [
    {
      id: 'off-01',
      title: 'Free Shipping Across Tamil Nadu',
      tamilTitle: 'தமிழ்நாடு முழுவதும் இலவச டெலிவரி',
      code: 'FREESHIP',
      discountPercent: 0,
      minOrderValue: 0,
      description: 'Zero shipping charges on all orders delivered anywhere across Tamil Nadu.',
      validFrom: '2026-01-01',
      validUntil: '2026-12-31',
      isActive: true,
      isBanner: false,
    },
    {
      id: 'off-02',
      title: 'Welcome First Order Discount',
      tamilTitle: 'முதல் ஆர்டருக்கு ₹100 தள்ளுபடி',
      code: 'WELCOME100',
      discountPercent: 10,
      minOrderValue: 999,
      description: 'Get ₹100 flat discount on your first healthy dry fruits order above ₹999.',
      validFrom: '2026-01-01',
      validUntil: '2026-12-31',
      isActive: true,
      isBanner: false,
    },
    {
      id: 'off-03',
      title: 'Mega Combo Special',
      tamilTitle: 'மெகா காம்போ 15% சிறப்பு சலுகை',
      code: 'COMBO15',
      discountPercent: 15,
      minOrderValue: 1499,
      description: 'Extra 15% OFF on all 15-in-1, 25-Item and Festive Gifting Combos.',
      linkedProductIds: ['combo-25-item', 'combo-15-in-1', 'gift-royal-velvet'],
      bannerImage: '/images/promotions/combo_banner.jpg',
      validFrom: '2026-01-01',
      validUntil: '2026-12-31',
      isActive: true,
      isBanner: true,
    },
    {
      id: 'off-04',
      title: 'Seeds Wellness Pack Offer',
      tamilTitle: 'சீட்ஸ் ஹெல்த் பேக் சிறப்பு விலை',
      code: 'SEEDS10',
      discountPercent: 10,
      minOrderValue: 499,
      description: 'Get 10% OFF on all Super Seeds combos and individual seed packs. Boost your daily nutrition!',
      linkedProductIds: ['combo-5-seeds'],
      bannerImage: '/images/promotions/seeds_banner.jpg',
      validFrom: '2026-01-01',
      validUntil: '2026-12-31',
      isActive: true,
      isBanner: true,
    },
  ];

  saveStoreToFile();
  console.log('✅ Initial DataStore initialized and saved to store.json');
};

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('📦 No MONGODB_URI provided. Running seamlessly on high-performance JSON persistence engine.');
    loadStoreFromFile();
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('🍃 Connected successfully to MongoDB!');
  } catch (error) {
    console.warn('⚠️ MongoDB connection attempt failed. Seamlessly falling back to local JSON persistence store.', error);
    loadStoreFromFile();
  }
};
