import { Request, Response } from 'express';
import { validateEmail, validatePassword } from '../validations/validations';
import { db } from '../database/models';
import path from 'path';
import { Console, log } from 'console';
import { logger } from 'sequelize/types/utils/logger';
import cloudinary from '../helps/cloudinaryConfig';
import upload from '../middleware/multer';
import { UploadApiResponse, ResourceType } from 'cloudinary';

class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const allProducts = await db.Product.findAll();
      return res
        .status(200)
        .json({ message: 'Products Retrieved', data: allProducts });
    } catch (error: any) {
      // Handle errors appropriately
      console.error('Error fetching products:', error);
      return res
        .status(500)
        .json({ message: 'Failed to retrieve products', error: error.message });
    }
  }

  static async getSingleProduct(req: Request, res: Response) {
    try {
      const singleProduct = await db.Product.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json({
        status: 'success',
        message: 'Retreived Product',
        data: singleProduct,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category, bonus, price, quantity, discount } =
        req.body;
      // Find the product by ID
      const singleProduct = await db.Product.findOne({
        where: { id: id },
      });

      if (!singleProduct) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }
      
      if (!req.body.name ||
        !req.body.description ||
        !req.body.category ||
        !req.body.bonus ||
        !req.body.price ||
        !req.body.quantity ||
        !req.body.discount) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields (name, description, category, bonus, price, quantity, discount) are required',
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
