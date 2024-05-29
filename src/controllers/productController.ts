import { Request, Response } from 'express';
import cloudinary from '../helps/cloudinaryConfig';
import { db } from '../database/models/index';
interface User {
  role: string;
  userId: string;
}

interface CustomRequest extends Request {
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
