import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllMedicines,
  searchMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getInventory,
  updateStock,
  createOrder,
  getOrders,
  updateOrderStatus,
  getPaymentHistory,
  acceptOrder,
  rejectOrder,
  cancelOrder
} from '../controllers/pharmacyController.js';

const router = express.Router();

// Public routes
router.get('/medicines', getAllMedicines);
router.get('/medicines/search', searchMedicines);
router.get('/medicines/:id', getMedicineById);

// Patient routes
router.post('/orders', protect, authorize('patient'), createOrder);
router.get('/orders', protect, authorize('patient', 'pharmacist'), getOrders);
router.post('/orders/:id/cancel', protect, authorize('patient'), cancelOrder);

// Pharmacist routes
router.post('/medicines', protect, authorize('pharmacist'), createMedicine);
router.put('/medicines/:id', protect, authorize('pharmacist'), updateMedicine);
router.delete('/medicines/:id', protect, authorize('pharmacist'), deleteMedicine);
router.get('/inventory', protect, authorize('pharmacist', 'patient'), getInventory);
router.put('/inventory/:id/stock', protect, authorize('pharmacist'), updateStock);
router.put('/orders/:id/status', protect, authorize('pharmacist'), updateOrderStatus);
router.post('/orders/:id/accept', protect, authorize('pharmacist'), acceptOrder);
router.post('/orders/:id/reject', protect, authorize('pharmacist'), rejectOrder);
router.get('/payment/history', protect, authorize('pharmacist'), getPaymentHistory);

export default router;