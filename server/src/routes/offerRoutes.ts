import { Router, Request, Response } from 'express';
import { memoryStore } from '../config/db';

const router = Router();

// Public endpoint - no authentication required
// Returns only active offers for customer-facing pages
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const activeOffers = memoryStore.offers.filter(o => o.isActive);
    res.json({
      success: true,
      offers: activeOffers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch offers' });
  }
});

export default router;
