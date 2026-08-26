import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/admin/all', authenticateToken, requireAdmin, getAllOrders);
router.get('/:id', optionalAuth, getOrderById);
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;
