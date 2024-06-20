import { Request, Response } from 'express';
import cloudinary from '../helps/cloudinaryConfig';
import { db } from '../database/models/index';
import { validateEmail, validatePassword } from '../validations/validations';
import path from 'path';
import { Console, log } from 'console';
import { logger } from 'sequelize/types/utils/logger';
import upload from '../middleware/multer';
import { UploadApiResponse, ResourceType } from 'cloudinary'
import { collectionEmitter } from '../utils/notifications/collectionAddedEmitter';
import { productEmitter } from '../utils/notifications/productAddedEmitter';
import { productAvailabilityEmitter } from '../utils/notifications/productAvailabilityEmitter';



export interface User {
  role: string;
  userId: string;
  userproductId: string;
  email: string;
  firstName: string;
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

    collectionEmitter.emit('created', { userId: req.user?.userId, firstName: req.user?.firstName, email: req.user?.email, collectionName: collection.name, created: collection.createdAt })

    return res.status(201).json(collection);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createProduct(req: CustomRequest, res: Response) {
  try {
    const userInfo = req.user;
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


    productEmitter.emit('created', { product, userInfo })

    return res
      .status(201)
      .json({ message: 'Product added successfully', product });
  } catch (error) {
    console.log(error);

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

  static async updateSingleProduct(req: CustomRequest, res: Response) {
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

      const productStatus = newStatus ? "Available" : "Not available"
      const userInfo = req.user;
      productAvailabilityEmitter.emit('updated', { product, userInfo, productStatus })
      console.log(`status: ${productStatus}`)
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
      console.error('Error updating product:', error);
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
}

export default ProductController;
