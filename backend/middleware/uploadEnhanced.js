import multer from 'multer';
import path from 'path';
import FileManager from '../uploads/fileManager.js';
import UploadSecurity from '../uploads/security.js';

// Enhanced multer configuration with security
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  try {
    UploadSecurity.validateFile(file);
    
    // Additional image dimension validation for images
    if (file.mimetype.startsWith('image/')) {
      UploadSecurity.validateImageDimensions(file)
        .then(() => cb(null, true))
        .catch(error => cb(new Error(error.message), false));
    } else {
      cb(null, true);
    }
  } catch (error) {
    cb(new Error(error.message), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UploadSecurity.maxFileSize,
    files: 5 // Maximum 5 files per request
  }
});

// Enhanced upload middleware with additional processing
export const processUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  // Add file information to request
  if (req.file) {
    req.file.secureFilename = UploadSecurity.generateSecureFilename(
      req.file.originalname,
      req.user?.id || 'anonymous',
      req.file.fieldname
    );
  }

  if (req.files) {
    req.files.forEach(file => {
      file.secureFilename = UploadSecurity.generateSecureFilename(
        file.originalname,
        req.user?.id || 'anonymous',
        file.fieldname
      );
    });
  }

  next();
};

// Error handling middleware for uploads
export const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }

  if (error.message.includes('File type not allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  if (error.message.includes('File size too large')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};