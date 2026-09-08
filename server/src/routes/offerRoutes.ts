import { Router, Request, Response } from 'express';
import Offer from '../models/Offer';

const router = Router();

// Public endpoint - no authentication required
// Returns only active offers for customer-facing pages
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const activeOffers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      offers: activeOffers,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch offers' });
  }
});

export default router;
