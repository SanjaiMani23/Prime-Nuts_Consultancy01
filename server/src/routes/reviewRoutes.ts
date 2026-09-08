import { Router } from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/', addReview);

export default router;
