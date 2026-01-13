// routes/video.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createVideoRoom,
    getVideoRoom,
    endVideoRoom
} from '../controllers/videoController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/create-room', createVideoRoom);
router.get('/room/:appointmentId', getVideoRoom);
router.post('/end-room', endVideoRoom);

export default router;
