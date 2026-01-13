import { uploadToCloudinary, deleteFromCloudinary, validateFile } from '../services/fileUploadService.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Validate file
    validateFile(req.file);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, 'general');

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        size: uploadResult.bytes
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    await deleteFromCloudinary(publicId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};