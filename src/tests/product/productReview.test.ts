import { Request, Response } from 'express';
import ProductReviewController from '../../controllers/ProductReviewController';
import { db } from '../../database/models';
import validateProductReview from '../../validations/validateProductReview';
import exp from 'constants';

interface User {
  role: string;
  userId: string;
}
interface CustomRequest extends Request {
  user?: User;
}

jest.mock('../../database/models', () => ({
  db: {
    User: {
      findOne: jest.fn(),
    },

    Product: {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    },
    ProductReview: {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));
describe('Product review controller and validation function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Review', () => {
    it('should return 404 if  the user with a given id not found', async () => {
      const req = {
        body: {
          reviewComment: 'review',
          rating: 1,
        },
        user: {
          userId: 'userId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);
      await ProductReviewController.Review(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'user with the given Id is not found',
      });
    });

    it('should return 404 if the product with a given id not found', async () => {
      const req = {
        body: {
          reviewComment: 'review',
          rating: 1,
        },
        user: {
          userId: 'userId',
        },
        params: {
          id: 'productId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce(null);
      await ProductReviewController.Review(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'product with the given id not found',
      });
    });

    it('should return 401 a user with a given id  has already reviewed the product', async () => {
      const req = {
        body: {
          reviewComment: 'review',
          rating: 1,
        },
        user: {
          userId: 'userId',
        },
        params: {
          id: 'productId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'productId',
        collectionId: 'collectionID',
      });
      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'reviewId',
        UserId: 'userId',
        ProductId: 'product',
      });
      await ProductReviewController.Review(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'you can review a product only once',
      });
    });

    it('should return 200  if the review is successfully created', async () => {
      const req = {
        body: {
          reviewComment: 'review',
          rating: 1,
        },
        user: {
          userId: 'userId',
        },
        params: {
          id: 'productId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'productId',
        collectionId: 'collectionID',
      });
      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce(null);
      (db.ProductReview.create as jest.Mock).mockResolvedValueOnce({
        id: 'productReviewId',
        userId: 'userId',
        productId: 'productId',
      });
      await ProductReviewController.Review(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'review recorded successfully',
      });
    });
    it('should return 500 if  a server error happens', async () => {
      const req = {
        body: {
          reviewComment: 'review',
          rating: 1,
        },
        user: {
          userId: 'userId',
        },
        params: {
          id: 'productId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('Server error');
      });

      await ProductReviewController.Review(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  describe('editReview', () => {
    it('should return 404 if the review with the given id is not found', async () => {
      const req = {
        body: {
          reviewComment: 'updated review',
          rating: 2,
        },
        user: {
          userId: 'userId',
        },
        params: {
          reviewId: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce(null);

      await ProductReviewController.editReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'review not found for the given product by the user',
      });
    });

    it('should return 404 if the review with the given id is not found', async () => {
      const req = {
        body: {
          reviewComment: 'updated review',
          rating: 2,
        },
        user: {
          userId: 'userId',
        },
        params: {
          reviewId: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce(null);

      await ProductReviewController.editReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'review not found for the given product by the user',
      });
    });

    it('should return 404 if the  user with the given id is not found', async () => {
      const req = {
        body: {
          reviewComment: 'updated review',
          rating: 2,
        },
        user: {
          userId: 'userId',
        },
        params: {
          reviewId: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await ProductReviewController.editReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'user with the given id not found',
      });
    });
    it('should return 200 if the review successfully edited', async () => {
      const req = {
        body: {
          reviewComment: 'updated review',
          rating: 2,
        },
        user: {
          userId: 'userId',
        },
        params: {
          reviewId: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'productReviewId',
        userId: 'userId',
        productId: 'productId',
        reviewComment: 'this is the comment',
        rating: 2,
        update: jest.fn(),
      });
      (db.ProductReview.update as jest.Mock).mockReturnValueOnce([1]);

      await ProductReviewController.editReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Review updated successfully',
      });
    });
    it('should return 500 if a server error occur', async () => {
      const req = {
        body: {
          reviewComment: 'updated review',
          rating: 2,
        },
        user: {
          userId: 'userId',
        },
        params: {
          reviewId: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });
      (db.ProductReview.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('server error');
      });

      await ProductReviewController.editReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  describe('deleteReview', () => {
    it('should  return a 404 if the user with  the i given id was not found', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          reviewId: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await ProductReviewController.deleteReview(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'user with the given id not found',
      });
    });
    it('should  return a 404 if the a productReview with  the  given id was not found', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });

      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce(null);
      await ProductReviewController.deleteReview(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'review not found for the given product by the user',
      });
    });

    it('should  return a 200 if a product Review  is deleted', async () => {
      const mockReview = { destroy: jest.fn() };

      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'userId',
        firstName: 'jacques',
        lastName: 'niyonkuru',
      });

      (db.ProductReview.findOne as jest.Mock).mockResolvedValueOnce(mockReview);
      await ProductReviewController.deleteReview(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Review deleted successfully',
      });
    });

    it('should return 500 if  a server error happens', async () => {
      const req = {
        body: {
          reviewComment: 'review',
          rating: 1,
        },
        user: {
          userId: 'userId',
        },
        params: {
          id: 'productId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.User.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('Server error');
      });

      await ProductReviewController.deleteReview(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('DeleteAllReviews', () => {
    it('should  return  404 if the product was not found', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'productId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Product.findOne as jest.Mock).mockResolvedValueOnce(null);
      await ProductReviewController.deleteAllReviews(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'product with the given id not found',
      });
    });

    it('should  return a 200 if a product Reviews are deleted', async () => {
      const mockReview = { destroy: jest.fn() };

      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'ProductId',
      });

      (db.ProductReview.destroy as jest.Mock).mockResolvedValueOnce(2);
      await ProductReviewController.deleteAllReviews(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All reviews deleted successfully',
      });
    });

    it('should return 500 if error occur', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.Product.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('server error');
      });
      await ProductReviewController.deleteAllReviews(req, res);
      expect(res.status).toHaveBeenLastCalledWith(500);
    });
  });

  describe('GetAllReviews', () => {
    it('should return 404 if the product with the given id was not found', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Product.findOne as jest.Mock).mockResolvedValueOnce(null);
      await ProductReviewController.getAllReviews(req, res);
      expect(res.status).toHaveBeenLastCalledWith(404),
        expect(res.json).toHaveBeenLastCalledWith({
          message: 'Product with the given id not found',
        });
    });

    it('should return 404 if the product  has no reviews ', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce({
        productId: 'id',
        name: '',
        collectionId: 'id',
      });
      (db.ProductReview.findAll as jest.Mock).mockResolvedValueOnce([]);
      await ProductReviewController.getAllReviews(req, res);
      expect(res.status).toHaveBeenLastCalledWith(404),
        expect(res.json).toHaveBeenLastCalledWith({
          message: 'this product has no reviews',
        });
    });

    it('should return 200 if all reviews were retrieved', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Product.findOne as jest.Mock).mockResolvedValueOnce({
        productId: 'id',
        name: '',
        collectionId: 'id',
      });
      (db.ProductReview.findAll as jest.Mock).mockResolvedValueOnce([
        { id: 'reviewId', reviewComment: 'this is the comment', rating: 2 },
      ]);
      await ProductReviewController.getAllReviews(req, res);
      expect(res.status).toHaveBeenLastCalledWith(200),
        expect(res.json).toHaveBeenLastCalledWith({
          message: 'reviews retrieved successfully',
          data: [
            { id: 'reviewId', reviewComment: 'this is the comment', rating: 2 },
          ],
        });
    });

    //  it('should return 200 if all reviews were retrieved',async()=>{
    //   const req = {
    //     user: {
    //       userId: 'userId',
    //     },
    //     params: {
    //       id: 'reviewId',
    //     },
    //   } as Partial<Request> as Request;

    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn(),
    //   } as Partial<Response> as Response;

    // await ProductReviewController.getAllReviews(req,res);
    // expect(res.status).toHaveBeenLastCalledWith(200),
    // expect(res.json).toHaveBeenLastCalledWith({
    //   message:'reviews retrieved successfully',

    // })

    //  })

    it('should return 500 an error occurs', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 'reviewId',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Product.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('sever error');
      });

      await ProductReviewController.getAllReviews(req, res);
      expect(res.status).toHaveBeenLastCalledWith(500);
    });
  });
});
