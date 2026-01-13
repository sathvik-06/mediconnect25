import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

export default router;