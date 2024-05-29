import express from 'express';
import WishlistController from '../controllers/wishlist';
import { authenticate } from '../middleware/wishlist';

const router = express.Router();

router.post('/:productId', authenticate,WishlistController.addToWishlist);
router.delete(
  '/:productId',authenticate,
  WishlistController.deleteFromWishlist
);
router.get('/', authenticate,WishlistController.getWishlist);
router.delete('/', authenticate,WishlistController.clearWishlist);

export default router;
