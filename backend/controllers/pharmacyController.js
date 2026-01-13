import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import redisClient from '../config/redis.js';

export const getAllMedicines = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    let query = { stock: { $gt: 0 } };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { manufacturer: new RegExp(search, 'i') },
        { composition: new RegExp(search, 'i') }
      ];
    }

    const medicines = await Medicine.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Medicine.countDocuments(query);

    res.json({
      success: true,
      medicines,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const searchMedicines = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const medicines = await Medicine.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { manufacturer: new RegExp(q, 'i') },
        { composition: new RegExp(q, 'i') }
      ],
      stock: { $gt: 0 }
    }).limit(10);

    res.json({
      success: true,
      medicines
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.json({
      success: true,
      medicine
    });
  } catch (error) {
    next(error);
  }
};

export const createMedicine = async (req, res, next) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();

    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      medicine
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      medicine
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const { search, sortBy = 'name', order = 'asc', page = 1, limit = 20 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { manufacturer: new RegExp(search, 'i') },
        { composition: new RegExp(search, 'i') }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const medicines = await Medicine.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Medicine.countDocuments(query);

    res.json({
      success: true,
      medicines,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      medicine
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { medicines, prescriptionId, deliveryAddress, paymentMethod } = req.body;

    console.log('Creating order for user:', req.user);
    console.log('User ID:', req.user._id || req.user.id);

    // Calculate total amount and validate stock
    let totalAmount = 0;
    for (const item of medicines) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine?.name || 'medicine'}`
        });
      }
      totalAmount += medicine.price * item.quantity;
    }

    const order = new Order({
      patient: req.user._id || req.user.id,
      medicines,
      prescription: prescriptionId,
      totalAmount,
      deliveryAddress,
      paymentMethod
    });

    await order.save();
    console.log('Order saved:', order);

    // Update stock
    for (const item of medicines) {
      await Medicine.findByIdAndUpdate(
        item.medicineId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    console.log('Getting orders for user:', req.user);
    console.log('User role:', req.user.role);

    let query = {};
    // If not pharmacist/admin, restrict to own orders
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      query.patient = req.user._id || req.user.id;
      console.log('Patient query:', query);
    }

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('medicines.medicineId', 'name price')
      .populate('prescription')
      .populate('patient', 'name') // Populate patient name for pharmacist
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    console.log('Found orders:', orders.length);

    res.json({
      success: true,
      orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    next(error);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Fetch orders where payment is successful
    const query = { paymentStatus: { $in: ['paid', 'refunded'] } };

    const payments = await Order.find(query)
      .select('totalAmount paymentStatus paymentMethod createdAt _id') // Select relevant fields
      .populate('patient', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform to match frontend expectation if needed, or frontend adapts
    const formattedPayments = payments.map(order => ({
      _id: order._id,
      orderId: order._id, // Using Order ID as Transaction ID for now
      transactionId: 'TXN-' + order._id.toString().substring(18), // Mock transaction ID
      amount: order.totalAmount,
      status: order.paymentStatus,
      method: order.paymentMethod,
      date: order.createdAt
    }));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      payments: formattedPayments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('medicines.medicineId')
      .populate('patient', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' }, // or 'processing'
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order accepted', order });
  } catch (error) {
    next(error);
  }
};

export const rejectOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', rejectionReason: reason },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Logic to restock items if they were deducted can be added here

    res.json({ success: true, message: 'Order rejected', order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Verify the order belongs to the requesting patient
    if (order.patient.toString() !== req.user._id.toString() && order.patient.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }
    
    // Only allow cancellation of pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel order with status: ${order.status}` 
      });
    }
    
    order.status = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by patient';
    await order.save();
    
    // Restock the medicines
    for (const item of order.medicines) {
      await Medicine.findByIdAndUpdate(
        item.medicineId,
        { $inc: { stock: item.quantity } }
      );
    }
    
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    next(error);
  }
};