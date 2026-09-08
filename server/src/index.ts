import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';
import offerRoutes from './routes/offerRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS with credentials for HttpOnly cookies
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    store: 'The Prime Nuts, Sundarapuram, Coimbatore',
    tagline: 'தரம் பிரீமியம், விலை மினிமம்!',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 The Prime Nuts API server is running on http://localhost:${PORT}`);
    console.log(`📍 Store: Opp. Abirami Hospital, Madukarai Main Road, Sundarapuram, Coimbatore – 641024`);
    console.log(`📞 Order Hotline: +91 99946 27970`);
  });
};

startServer();
