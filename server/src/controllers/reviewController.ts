import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
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

    const reviewData = {
      productId,
      userName: userName.trim(),
      userCity: userCity?.trim() || 'Tamil Nadu',
      rating: Number(rating),
      comment: comment.trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    const newReview = new Review(reviewData);
    await newReview.save();

    // Update product average rating
    const isObjectId = productId.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: productId } : { id: productId }; // Since legacy might use custom ID
    
    // In our migration, products might have slug or _id, but frontend sends productId which used to be `prod-...`
    // Let's assume productId matches `id` stored earlier or `_id`. We'll query both to be safe, but since we didn't preserve custom `id` in MongoDB schema except mapping via toJSON, let's query by string `_id` if it's ObjectId, else we might not find it if it was dropped. Wait, the frontend sends `product.id`. `id` is mapped to `_id`.
    
    // Actually, in the migration script, we didn't store `id`, we let MongoDB generate `_id`.
    // But `store.json` products had custom `id` like `prod-cashews`. Since we dropped `id` in the schema and let Mongoose generate `_id`, the frontend might still be using the new `_id` if it fetches from DB. We'll use `_id`.
    
    try {
      const allReviews = await Review.find({ productId });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      
      const productObjId = productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null;
      if (productObjId) {
        await Product.findByIdAndUpdate(productObjId, {
          rating: Number(avg.toFixed(1)),
          reviewCount: allReviews.length
        });
      }
    } catch (updateErr) {
      console.error('Failed to update product review stats', updateErr);
    }

    res.status(201).json({
      success: true,
      message: 'Review posted! Thank you for sharing your experience.',
      review: newReview,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};
