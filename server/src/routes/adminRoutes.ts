import { Router } from 'express';
import { getStats, getCustomers, getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getStats);
router.get('/customers', getCustomers);
router.get('/offers', getOffers);
router.post('/offers', createOffer);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

export default router;
