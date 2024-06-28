import { Request, Response } from 'express';
import { db } from '../database/models';
import AddressController from '../controllers/addressController';

jest.mock('../database/models', () => ({
  db: {
    Address: {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../helps/stripeConfig', () => ({
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
}));

describe('OrderController', () => {
  const mockUser: any = {
    userId: '20600b6c-3784-4f3c-b639-f2e44ab77ab7',
  };

  const mockAddress: any = {
    dataValues: {
      addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
      userId: mockUser.userId,
      country: 'Rwanda',
      province: 'Kigali',
      district: 'Nyarugenge',
      sector: 'Muhima',
      street: 'KN 312 St',
    },
    update: jest.fn(),
    destroy: jest.fn(),
  };

  describe('getUserAddress', () => {
    it('should return 200 when address is retrieved', async () => {
      const req = {
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockReturnValue(mockAddress);

      await AddressController.getUserAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAddress });
    });

    it('should return 500 when database error occurs', async () => {
      const req = {
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockImplementation(() => {
        throw new Error('Database Error');
      });
      await AddressController.getUserAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get user address',
      });
    });
  });

  describe('addAddress', () => {
    it('should return 400 when missing information', async () => {
      const req = {
        body: {},
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await AddressController.addAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing Address Information',
      });
    });

    it('should return 403 when user address already exists', async () => {
      const req = {
        body: {
          country: mockAddress.dataValues.country,
          province: mockAddress.dataValues.province,
          district: mockAddress.dataValues.district,
          sector: mockAddress.dataValues.sector,
          street: mockAddress.dataValues.street,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockReturnValue(mockAddress);

      await AddressController.addAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User address already exists',
      });
    });

    it('should return 200 when address is added', async () => {
      const req = {
        body: {
          country: mockAddress.dataValues.country,
          province: mockAddress.dataValues.province,
          district: mockAddress.dataValues.district,
          sector: mockAddress.dataValues.sector,
          street: mockAddress.dataValues.street,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockReturnValue(null);
      db.Address.create.mockReturnValue(mockAddress);

      await AddressController.addAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Address added',
        data: mockAddress,
      });
    });

    it('should return 500 when database error occurs', async () => {
      const req = {
        body: {
          country: mockAddress.dataValues.country,
          province: mockAddress.dataValues.province,
          district: mockAddress.dataValues.district,
          sector: mockAddress.dataValues.sector,
          street: mockAddress.dataValues.street,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.create.mockImplementation(() => {
        throw new Error('Database Error');
      });
      await AddressController.addAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to add address',
      });
    });
  });

  describe('updateAddress', () => {
    it('should return 400 when missing information', async () => {
      const req = {
        body: {},
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await AddressController.updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing Address Information',
      });
    });

    it('should return 200 when address is updated', async () => {
      const req = {
        body: {
          country: mockAddress.dataValues.country,
          province: mockAddress.dataValues.province,
          district: mockAddress.dataValues.district,
          sector: mockAddress.dataValues.sector,
          street: mockAddress.dataValues.street,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockReturnValue(mockAddress);

      await AddressController.updateAddress(req, res);

      expect(mockAddress.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Address updated',
        data: mockAddress,
      });
    });

    it('should return 500 when database error occurs', async () => {
      const req = {
        body: {
          country: mockAddress.dataValues.country,
          province: mockAddress.dataValues.province,
          district: mockAddress.dataValues.district,
          sector: mockAddress.dataValues.sector,
          street: mockAddress.dataValues.street,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockImplementation(() => {
        throw new Error('Database Error');
      });
      await AddressController.updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update address',
      });
    });
  });

  describe('deleteAddress', () => {
    it('should return 404 when user address does not exist', async () => {
      const req = {
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockReturnValue(null);

      await AddressController.deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No address found' });
    });

    it('should return 200 when address is deleted', async () => {
      const req = {
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockReturnValue(mockAddress);

      await AddressController.deleteAddress(req, res);

      expect(mockAddress.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Address deleted' });
    });

    it('should return 500 when database error occurs', async () => {
      const req = {
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findOne.mockImplementation(() => {
        throw new Error('Database Error');
      });
      await AddressController.deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete address',
      });
    });
  });
});
