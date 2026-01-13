import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getUsers,
    verifyUser,
    deleteUser,
    getAllAppointments
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/verify', verifyUser);
router.delete('/users/:id', deleteUser);
router.get('/appointments', getAllAppointments);

export default router;
