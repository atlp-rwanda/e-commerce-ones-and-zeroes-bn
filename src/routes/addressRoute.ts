import express, { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import AddressController from '../controllers/addressController';

const router: Router = express.Router();

router.get('/', authMiddleware.verifyToken, AddressController.getUserAddress);
router.post('/', authMiddleware.verifyToken, AddressController.addAddress);
router.put('/', authMiddleware.verifyToken, AddressController.updateAddress);
router.delete('/', authMiddleware.verifyToken, AddressController.deleteAddress);

export default router;
