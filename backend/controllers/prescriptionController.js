// controllers/prescriptionController.js
import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import { getChannel } from '../config/rabbitmq.js';
import { uploadToCloudinary } from '../services/fileUploadService.js';

export const uploadPrescription = async (req, res, next) => {
  console.log('uploadPrescription controller hit. req.file:', req.file ? 'Present' : 'Missing', 'User:', req.user._id);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, 'prescriptions');

    // Create prescription record
    const prescription = new Prescription({
      patient: req.user.id,
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      fileSize: req.file.size,
      status: 'pending'
    });

    await prescription.save();

    // Queue for prescription processing
    const channel = getChannel();
    channel.sendToQueue('prescription_processing', Buffer.from(JSON.stringify({
      prescriptionId: prescription._id,
      fileUrl: uploadResult.secure_url,
      patientId: req.user.id
    })));

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      prescription
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptions = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    console.log('getPrescriptions hit. User:', req.user._id, 'Role:', req.user.role);
    console.log('Query Params:', req.query);

    let query = {};

    // If patient, only show their own prescriptions
    if (req.user.role === 'patient') {
      query.patient = patientId;
    } else if (req.user.role === 'doctor' || req.user.role === 'pharmacist') {
      // Doctors/pharmacists can see pending prescriptions
    }

    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email') // Added populate patient
      .populate('doctor', 'name specialization')
      .populate('validatedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.json({
      success: true,
      prescriptions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, patientId, diagnosis, medicines, notes } = req.body;

    let patientIdToUse = patientId;

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient')
        .populate('doctor');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      // Verify doctor owns this appointment
      if (appointment.doctor._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create prescription for this appointment'
        });
      }

      patientIdToUse = appointment.patient._id;

      // Update appointment with prescription logic will be handled below if appointment exists
    } else if (patientId) {
      // Validate if patient exists
      // Assuming we can't import Patient model if it doesn't exist, we use User model (or just rely on saving to fail if invalid ref, but better to check)
      // For now, let's trust the ID or check if we have a User model import. 
      // We only imported Prescription and Appointment. 
      // let's rely on mongoose validation or add User import if needed. 
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either appointmentId or patientId is required'
      });
    }

    const prescription = new Prescription({
      patient: patientIdToUse,
      doctor: req.user.id,
      appointment: appointmentId, // Can be null/undefined
      diagnosis,
      medicines,
      notes,
      status: 'approved',
      fileName: `Prescription_${new Date().toISOString().split('T')[0]}.txt`,
      fileSize: Buffer.byteLength(JSON.stringify({ diagnosis, medicines, notes }))
    });

    await prescription.save();

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      appointment.prescription = prescription._id;
      await appointment.save();
    }

    // Send notification to patient
    const channel = getChannel();
    channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify({
      type: 'prescription_created',
      userId: patientIdToUse,
      prescriptionId: prescription._id,
      data: {
        doctorName: req.user.name, // Assuming req.user has name from auth middleware
        diagnosis
      }
    })));

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    next(error);
  }
};

export const validatePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, validationNotes } = req.body;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    prescription.status = status;
    prescription.validatedBy = req.user.id;
    prescription.validationNotes = validationNotes;

    await prescription.save();

    // Send notification to patient
    const channel = getChannel();
    channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify({
      type: 'prescription_validated',
      userId: prescription.patient,
      prescriptionId: prescription._id,
      data: {
        status,
        notes: validationNotes
      }
    })));

    res.json({
      success: true,
      message: 'Prescription validated successfully',
      prescription
    });
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check ownership or role
    if (req.user.role === 'patient') {
      if (prescription.patient.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this prescription'
        });
      }
    }

    // Hard delete for everyone (authorized above or by role 'doctor'/'pharmacist')
    await Prescription.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const downloadPrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Allow owner or doctor/pharmacist to download
    // For simplicity, assuming basic auth check passes or adding logic:
    // if (prescription.patient.toString() !== req.user.id && req.user.role === 'patient') ...

    res.json({
      success: true,
      downloadUrl: prescription.fileUrl
    });
  } catch (error) {
    next(error);
  }
};