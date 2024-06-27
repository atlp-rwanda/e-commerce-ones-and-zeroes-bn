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
  authMiddleware.checkRole('seller'),
  OrderController.confirmOrderPayment,
);

router.get(
  '/:orderId/status',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('buyer'),
  OrderController.getOrderStatus,
);

router.put(
  '/:orderId/status',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('admin'),
  OrderController.updateOrderStatus,
);

router.put(
  '/:orderId/cancel',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('buyer'),
  OrderController.cancelOrder,
);

router.put(
  '/:orderId/fail',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('seller'),
  OrderController.failOrder,
);

router.put(
  '/:orderId/refund',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('seller'),
  OrderController.refundOrder,
);

router.put(
  '/:orderId/deliver',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('seller'),
  OrderController.deliverOrder,
);

export default router;
