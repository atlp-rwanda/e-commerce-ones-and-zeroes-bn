import { Request, Response } from 'express';
import multer from 'multer';
import upload from '../middleware/multerConfig';
import cloudinary from './cloudinaryConfig';

export async function handleUpload(
  req: Request,
  res: Response,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    upload.array('images')(req, res, async function (err: any) {
      try {
        if (err instanceof multer.MulterError) {
          return reject({ message: 'File upload error' });
        } else if (err) {
          return reject({ message: 'There is a problem uploading' });
        }

        if (!req.files || req.files.length === 0) {
          return res.status(505).json({ message: 'No files uploaded' });
        }

        const files: Express.Multer.File[] = Object.values(req.files).flat();

        const uploadedImageUrls = await Promise.all(
          files.map(async (file) => {
            try {
              const result = await cloudinary.uploader.upload(file.path);
              return result.secure_url;
            } catch (uploadError) {
              return '';
            }
          }),
        );

        resolve(uploadedImageUrls.filter((url) => url !== ''));
      } catch (error) {
        reject({ message: 'Internal Server Error in Upload' });
      }
    });
  });
}
