import CartController from '../controllers/cartController';
import express, { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/', authMiddleware.verifyToken, CartController.getCartProducts);
router.post('/', authMiddleware.verifyToken, CartController.addProduct);
router.put(
  '/product/:productId',
  authMiddleware.verifyToken,
  CartController.updateCartProduct,
);
router.delete(
  '/product/:productId',
  authMiddleware.verifyToken,
  CartController.removeProduct,
);
router.delete('/clear', authMiddleware.verifyToken, CartController.clearCart);
router.post(
  '/:cartId/checkout',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  CartController.checkoutCart,
);

export default router;
