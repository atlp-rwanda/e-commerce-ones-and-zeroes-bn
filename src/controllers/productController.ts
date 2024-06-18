import { Request, Response } from 'express';
import cloudinary from '../helps/cloudinaryConfig';
import { db } from '../database/models/index';
import { verify } from 'crypto';
import { authenticateToken } from '../config/jwt.token';
import ProductService from '../services/productService';
import CollectionService from '../services/collectionService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { validateEmail, validatePassword } from '../validations/validations';
import path from 'path';
import { Console, log } from 'console';
import { logger } from 'sequelize/types/utils/logger';
import upload from '../middleware/multer';
import { UploadApiResponse, ResourceType } from 'cloudinary';

interface User {
  role: string;
  userId: string;
  userproductId: string;
}

export interface CustomRequest extends Request {
  user?: User;
  files?: any;
}

export async function createCollection(req: CustomRequest, res: Response) {
  try {
    const userInfo = req.user;
    const { name } = req.body;
    const sellerId = userInfo?.userId;

    if (!name || !sellerId) {
      return res.status(400).json({ error: 'Name and sellerId are required' });
    }

    const user = await db.User.findByPk(sellerId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingCollection = await db.Collection.findOne({
      where: {
        name: name,
        sellerId: sellerId,
      },
    });

    if (existingCollection) {
      return res.status(400).json({ error: 'Collection already exists' });
    }

    const collection = await db.Collection.create({
      name: name,
      sellerId: sellerId,
    });

    return res.status(201).json(collection);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createProduct(req: CustomRequest, res: Response) {
  try {
    const { collectionId } = req.params;
    const { name, price, category, quantity, expiryDate, bonus } = req.body;

    if (!name || !price || !category || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const fileImages = req.files;
    if (!fileImages || fileImages.length === 0) {
      return res.status(400).json({ message: 'No images given' });
    }

    const collection = await db.Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const existingProduct = await db.Product.findOne({
      where: {
        name: name,
        collectionId: collectionId,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: 'Product already exists in this collection',
        existingProduct,
      });
    }

    if (fileImages.length < 4 || fileImages.length > 8) {
      return res
        .status(400)
        .json({ error: 'Product must have between 4 to 8 images' });
    }

    let uploadedImageUrls: any = [];
    for (let i = 0; i < fileImages.length; i++) {
      const file = fileImages[i];
      const base64String = file.buffer.toString('base64');
      const fileBase64 = `data:${file.mimetype};base64,${base64String}`;
      const result = await cloudinary.uploader.upload(fileBase64);
      uploadedImageUrls.push(result.secure_url);
    }

    const product = await db.Product.create({
      name,
      price,
      category,
      quantity,
      expiryDate: expiryDate || null,
      bonus: bonus || null,
      images: uploadedImageUrls,
      collectionId,
    });

    return res
      .status(201)
      .json({ message: 'Product added successfully', product });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}

export async function getProducts(req: any, res: Response) {
  const products = await db.Product.findAll({
    where: {
      expired: false,
    },
  });
  if (products.length <= 0) {
    return res.status(404).json({ message: 'no Products in store' });
  }
  return res.status(200).json(products);
}

export class ProductController {
  static async getAvailableProduct(req: Request, res: Response) {
    try {
      const allAvailableProducts = await db.Product.findAll({
        where: {
          isAvailable: true,
        },
      });
      if (!allAvailableProducts.length) {
        return res
          .status(404)
          .json({ message: 'No available products in our store' });
      }
      res.status(200).json({
        message: 'List of available products in our store',
        allAvailableProducts,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async updateSingleProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res
          .status(400)
          .json({ message: 'Product productId is required' });
      }

      const product = await db.Product.findOne({ where: { productId } });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const newStatus = !product.isAvailable;

      await db.Product.update(
        { isAvailable: newStatus },
        { where: { productId } },
      );

      res.status(200).json({
        message: `Product is successfully marked as ${newStatus ? 'available' : 'unavailable'}`,
        isAvailable: newStatus,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getSingleProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const singleProduct = await db.Product.findOne({
        where: {
          productId,
        },
      });
      return res.status(200).json({
        status: 'success',
        message: 'Retreived Product',
        data: singleProduct,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { name, description, category, bonus, price, quantity, discount } =
        req.body;
      // Find the product by ID
      const singleProduct = await db.Product.findOne({
        where: { productId },
      });

      if (!singleProduct) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }

      if (
        !req.body.name ||
        !req.body.description ||
        !req.body.category ||
        !req.body.bonus ||
        !req.body.price ||
        !req.body.quantity ||
        !req.body.discount
      ) {
        return res.status(400).json({
          status: 'error',
          message:
            'All fields (name, description, category, bonus, price, quantity, discount) are required',
        });
      }

      if (req.body.name) {
        singleProduct.name = req.body.name;
      }
      if (req.body.description) {
        singleProduct.description = req.body.description;
      }
      if (req.body.category) {
        singleProduct.category = req.body.category;
      }
      if (req.body.bonus) {
        singleProduct.bonus = req.body.bonus;
      }
      if (req.body.price) {
        singleProduct.price = req.body.price;
      }
      if (req.body.quantity) {
        singleProduct.quantity = req.body.quantity;
      }
      if (req.body.discount) {
        singleProduct.discount = req.body.discount;
      }

      // Handle multiple file uploads if present
      if (req.files && Array.isArray(req.files)) {
        // Define resourceType if necessary. For image uploads, resource_type is typically 'image'.
        const resourceType = 'image';

        // Check if the total images will exceed the maximum allowed number
        if (req.files.length > 9) {
          return res.status(400).json({
            status: 'error',
            message:
              'You reached the maximum number of images a product can have',
          });
        }

        // Upload each file to Cloudinary and update the product's images array
        const uploadPromises = req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: resourceType,
          }),
        );

        const results = await Promise.all(uploadPromises);
        const uploadedUrls = results.map((result) => result.secure_url);
        singleProduct.images = [...uploadedUrls];
      }

      // Update the updatedAt field
      singleProduct.updatedAt = new Date();

      // Save the updated product
      await singleProduct.save();

      return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: singleProduct,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
  static async removeProductImage(req: Request, res: Response) {
    const { id, images } = req.body;

    try {
      // Find the product by ID
      const product = await db.Product.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({
          status: 'Internal Server Error',
          error: 'Invalid image_url array in database',
        });
      }

      // Ensure image_url is a valid array
      if (!Array.isArray(product.images)) {
        return res.status(400).json({
          status: 'fail',
          error: 'Invalid image_url array in database',
        });
      }

      // Remove the image URL
      const updatedImages = product.images.filter(
        (url: string) =>
          url.trim().toLowerCase() !== images.trim().toLowerCase(),
      );

      // Check if any image was removed
      if (updatedImages.length === product.images.length) {
        return res.status(400).json({
          status: 'Bad Request',
          error: 'Image URL not found in product',
        });
      }

      // Update the product's images
      product.images = updatedImages;
      await product.save();

      return res.status(200).json({
        status: 'Image removed successfully',
        data: product,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'Internal Server Error',
        error: err.message,
      });
    }
  }
  static async deleteProduct(req: any, res: any) {
    const { id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined ');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { userId, role } = decoded;

    // Scenario 3: If the request body fails validation checks or the user is not a seller
    if (role !== 'seller') {
      return res
        .status(403)
        .json({ error: 'You must be a seller to delete a product.' });
    }

    const product = await ProductService.getProductById(id);

    // Scenario 1: Check if the user is a seller and if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Fetch the collection that the product belongs to
    const collection = await CollectionService.getCollectionById(
      product.collectionId,
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found.' });
    }

    if (collection.sellerId !== userId) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own products.' });
    }

    // Scenario 2: If the user is a seller and the product exists, delete the product
    const deletedProduct = await ProductService.deleteProduct(id);

    return res.status(200).json({
      message: 'Product deleted successfully.',
      product: deletedProduct,
    });
  }
}
