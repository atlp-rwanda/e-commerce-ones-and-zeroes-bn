
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';

// // Configure multer storage and file name
// const storage = multer.diskStorage({
//   destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Create multer upload instance
// const upload = multer({ storage: storage });

// // Custom file upload middleware
// const uploadMiddleware = (req: { files: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; errors?: any[]; }): any; new(): any; }; }; }, next: () => void) => {
//   // Use multer upload instance
//   upload.array('files', 5)(req, res, (err: { message: any; }) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     // Retrieve uploaded files
//     const files = req.files;
//     const errors: string[] = [];

//     // Validate file types and sizes
//     files.forEach((file: { mimetype: string; originalname: any; size: number; }) => {
//       const allowedTypes = ['image/jpeg', 'image/png'];
//       const maxSize = 5 * 1024 * 1024; // 5MB

//       if (!allowedTypes.includes(file.mimetype)) {
//         errors.push(`Invalid file type: ${file.originalname}`);
//       }

//       if (file.size > maxSize) {
//         errors.push(`File too large: ${file.originalname}`);
//       }
//     });

//     // Handle validation errors
//     if (errors.length > 0) {
//       // Remove uploaded files
//       files.forEach((file: { path: any; }) => {
//         fs.unlinkSync(file.path);
//       });

//       return res.status(400).json({ errors });
//     }

//     // Attach files to the request object
//     req.files = files;

//     // Proceed to the next middleware or route handler
//     next();
//   });
// };

// export default uploadMiddleware;