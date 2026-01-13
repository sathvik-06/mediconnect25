import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload, processUpload, handleUploadErrors } from '../middleware/uploadEnhanced.js';
import FileManager from '../uploads/fileManager.js';

const router = express.Router();

// Upload single file
router.post(
  '/single',
  protect,
  upload.single('file'),
  processUpload,
  handleUploadErrors,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      let savedFile;
      
      // Determine where to save based on file type and context
      if (req.body.type === 'prescription') {
        savedFile = await FileManager.savePrescription(req.file, req.user.id);
      } else if (req.body.type === 'profile') {
        savedFile = await FileManager.saveProfilePicture(req.file, req.user.id);
      } else {
        savedFile = await FileManager.saveTempFile(req.file, req.file.secureFilename);
      }

      res.json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          filename: savedFile.filename,
          url: savedFile.url,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading file',
        error: error.message
      });
    }
  }
);

// Upload multiple files
router.post(
  '/multiple',
  protect,
  upload.array('files', 5),
  processUpload,
  handleUploadErrors,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const savedFiles = [];

      for (const file of req.files) {
        const savedFile = await FileManager.saveTempFile(file, file.secureFilename);
        savedFiles.push({
          filename: savedFile.filename,
          url: savedFile.url,
          size: file.size,
          mimetype: file.mimetype,
          originalName: file.originalname
        });
      }

      res.json({
        success: true,
        message: `${savedFiles.length} files uploaded successfully`,
        files: savedFiles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading files',
        error: error.message
      });
    }
  }
);

// Get file
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { type = 'temp' } = req.query;

    let filePath;
    
    switch (type) {
      case 'prescription':
        filePath = path.join(FileManager.prescriptionsDir, filename);
        break;
      case 'profile':
        filePath = path.join(FileManager.profilesDir, filename);
        break;
      default:
        filePath = path.join(FileManager.tempDir, filename);
    }

    // Validate file path for security
    FileManager.validateFilePath(filePath);

    const fileInfo = await FileManager.getFileInfo(filePath);
    
    if (!fileInfo.exists) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    const fileStream = await FileManager.getFile(filePath);
    res.send(fileStream);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

// Delete file
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const { type = 'temp' } = req.query;

    let filePath;
    
    switch (type) {
      case 'prescription':
        filePath = path.join(FileManager.prescriptionsDir, filename);
        break;
      case 'profile':
        filePath = path.join(FileManager.profilesDir, filename);
        break;
      default:
        filePath = path.join(FileManager.tempDir, filename);
    }

    // Validate file path
    FileManager.validateFilePath(filePath);

    const deleted = await FileManager.deleteFile(filePath);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get storage statistics (admin only)
router.get('/admin/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const stats = await FileManager.getStorageStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting storage stats',
      error: error.message
    });
  }
});

export default router;