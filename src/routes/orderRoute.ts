import { Router } from 'express';
import OrderController from '../controllers/orderController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = Router();

router.get(
  '/:orderId',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  OrderController.getOrder,
);
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  OrderController.createOrder,
);
router.put(
  '/:orderId/confirm',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  OrderController.confirmOrderPayment,
);

export default router;
