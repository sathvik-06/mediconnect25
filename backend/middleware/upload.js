import multer from 'multer';
import path from 'path';
import { validateFile } from '../services/fileUploadService.js';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination called for file:', file.originalname);
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log('Multer filename called');
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Multer fileFilter called for:', file.originalname, 'Mime:', file.mimetype);
  try {
    validateFile(file);
    console.log('File validation passed');
    cb(null, true);
  } catch (error) {
    console.error('File validation failed:', error.message);
    cb(new Error(error.message), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE)
  }
});