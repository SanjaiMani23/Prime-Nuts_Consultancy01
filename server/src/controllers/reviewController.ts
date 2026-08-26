import { Request, Response } from 'express';
import { memoryStore, saveStoreToFile } from '../config/db';
import { Review } from '../types';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = memoryStore.reviews.filter(r => r.productId === productId);

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, userName, userCity, rating, comment } = req.body;

    if (!productId || !userName || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Product, name, rating, and review text are required.' });
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: userName.trim(),
      userCity: userCity?.trim() || 'Tamil Nadu',
      rating: Number(rating),
      comment: comment.trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    memoryStore.reviews.unshift(newReview);

    // Update product average rating
    const product = memoryStore.products.find(p => p.id === productId);
    if (product) {
      const productReviews = memoryStore.reviews.filter(r => r.productId === productId);
      const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      product.rating = Number(avg.toFixed(1));
      product.reviewCount = productReviews.length;
    }

    saveStoreToFile();

    res.status(201).json({
      success: true,
      message: 'Review posted! Thank you for sharing your experience.',
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};
