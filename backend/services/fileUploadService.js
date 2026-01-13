// services/fileUploadService.js
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Checking Cloudinary Config:', {
    cloudName: cloudName ? 'Set' : 'Missing',
    apiKey: apiKey ? 'Set' : 'Missing',
    hasPlaceholder: cloudName?.includes('your_') || apiKey?.includes('your_')
  });

  return cloudName &&
    !cloudName.includes('your_') &&
    apiKey &&
    !apiKey.includes('your_') &&
    apiSecret;
};

export const uploadToCloudinary = async (file, folder) => {
  console.log('Starting upload. File:', file.path, 'Folder:', folder);
  try {
    if (isCloudinaryConfigured()) {
      console.log('Cloudinary is configured. Uploading...');
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: `mediconnect/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      });

      // Delete local file after upload
      fs.unlinkSync(file.path);

      return result;
    } else {
      console.log('Cloudinary NOT configured. Using local fallback.');

      // Fallback to local storage
      const uploadDir = path.join('uploads', folder);
      console.log('Target directory:', uploadDir);

      if (!fs.existsSync(uploadDir)) {
        console.log('Creating directory:', uploadDir);
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = path.basename(file.path);
      const targetPath = path.join(uploadDir, fileName);
      console.log('Copying file to:', targetPath);

      // Move file from temp to target directory
      fs.copyFileSync(file.path, targetPath);
      // Try to unlink, ignore error if fails (e.g. permission or lock)
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkErr) {
        console.warn('Could not delete temp file:', unlinkErr.message);
      }

      const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
      const fileUrl = `${serverUrl}/${uploadDir.replace(/\\/g, '/')}/${fileName}`;

      console.log('Upload successful. URL:', fileUrl);

      return {
        secure_url: fileUrl,
        public_id: `local_${folder}_${fileName}`,
        format: path.extname(fileName).substring(1),
        bytes: file.size
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up local file on error
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error('Error cleaning up file:', e);
      }
    }
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId.startsWith('local_')) {
      console.log('Skipping deletion of local file:', publicId);
      return;
    }

    if (isCloudinaryConfigured()) {
      await cloudinary.v2.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const validateFile = (file) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',');
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('File type not allowed');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large');
  }

  return true;
};