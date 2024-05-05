import ProductReviewController from '../controllers/ProductReviewController';
import authMiddleware from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();
router.post(
  '/:id/review',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  ProductReviewController.Review,
);
router.get('/:id/review', ProductReviewController.getAllReviews);
router.put(
  '/:id/review',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  ProductReviewController.editReview,
);
router.delete(
  '/:id/review',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  ProductReviewController.deleteReview,
);
router.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole,
  ProductReviewController.deleteAllReviews,
);

export default router;
