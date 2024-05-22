import { Request, Response } from 'express';
import { validateEmail, validatePassword } from '../validations/validations';
import { db } from '../database/models';
import path from 'path';

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
          product_id: req.params.id,
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
      const singleProduct = await db.Product.findOne({
        where: {
          product_id: req.params.id,
        },
      });
      const { name, description, price, quantity, discount, expiry_date } =
        req.body;
      if (name) {
        singleProduct.name = name;
      }
      if (description) {
        singleProduct.description = description;
      }
      if (price) {
        singleProduct.price = price;
      }
      if (quantity) {
        singleProduct.quantity = quantity;
      }
      if (discount) {
        singleProduct.discount = discount;
      }
      if (expiry_date) {
        singleProduct.expiry_date = expiry_date;
      }
      singleProduct.updatedAt = new Date();

      await singleProduct.save();
      return res.status(200).json({
        status: 'Product updated successfully',
        data: singleProduct,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'Internal Server Error',
        error: err.message,
      });
    }
  }
  static async removeProductImage(req: Request, res: Response) {
    const { product_id, image_url } = req.body;

    try {
      // Find the product by ID
      const product = await db.Product.findOne({ where: { product_id } });

      if (!product) {
        return res.status(404).json({
          status: 'Not Found',
          error: 'Product not found',
        });
      }

      // Ensure image_url is a valid array
      if (!Array.isArray(product.image_url)) {
        return res.status(500).json({
          status: 'Internal Server Error',
          error: 'Invalid image_url array in database',
        });
      }

      // Remove the image URL
      const updatedImages = product.image_url.filter(
        (url: string) =>
          url.trim().toLowerCase() !== image_url.trim().toLowerCase(),
      );

      // Check if any image was removed
      if (updatedImages.length === product.image_url.length) {
        return res.status(400).json({
          status: 'Bad Request',
          error: 'Image URL not found in product',
        });
      }

      // Update the product's images
      product.image_url = updatedImages;
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
  // static async uploadMultipleImages(req:Request, res:Response){
  //   try {
  //     // Handle the uploaded files
  //   const files = req.files;

  //   // Process and store the files as required
  //   // For example, save the files to a specific directory using fs module
  //   files.forEach((file: { filename: any; path: any; }) => {
  //     const filePath = `uploads/${file.filename}`;
  //     fs.rename(file.path, filePath, (err: any) => {
  //       if (err) {
  //         // Handle error appropriately and send an error response
  //         return res.status(500).json({ error: 'Failed to store the file' });
  //       }
  //     });
  //   });

  //   // Send an appropriate response to the client
  //   res.status(200).json({ message: 'File upload successful' });
  //   } catch (error) {

  //   }
  // }
}

export default ProductController;
