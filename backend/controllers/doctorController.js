// controllers/doctorController.js
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import '../models/Patient.js'; // Register Patient discriminator
import redisClient from '../config/redis.js';
import Prescription from '../models/Prescription.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Total Patients (Unique patients from valid appointments)
    // We already have logic for this in getDoctorPatients, but distinct is faster for just a count
    // Using distinct on 'patient' field for this doctor's appointments
    const totalPatients = (await Appointment.distinct('patient', {
      doctor: doctorId,
      status: { $in: ['confirmed', 'completed'] }
    })).length;

    // 2. Today's Appointments (All non-cancelled appointments for today)
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'rejected'] }
    });

    // 3. Pending Reports (Appointments completed but no prescription yet)
    // First get completed appointments
    const completedAppointments = await Appointment.find({
      doctor: doctorId,
      status: 'completed',
      // Optional: Limit to recent time window if needed
    }).select('_id');

    const completedAppointmentIds = completedAppointments.map(a => a._id);

    // Count how many have prescriptions (using distinct to be safe against duplicates)
    const appointmentsWithPrescription = await Prescription.distinct('appointment', {
      appointment: { $in: completedAppointmentIds }
    });

    const pendingReports = completedAppointmentIds.length - appointmentsWithPrescription.length;

    res.json({
      success: true,
      stats: {
        totalPatients,
        todayAppointments,
        pendingReports
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getAllDoctors = async (req, res, next) => {
  try {
    const {
      specialty,
      search,
      availability,
      page = 1,
      limit = 10
    } = req.query;

    // Check cache first
    const cacheKey = `doctors:${specialty}:${search}:${availability}:${page}:${limit}`;
    console.log('getAllDoctors Query:', { specialty, search, availability, page, limit });

    // TEMPORARILY DISABLE CACHE FOR DEBUGGING
    // const cachedDoctors = await redisClient.get(cacheKey);
    const cachedDoctors = null;

    if (cachedDoctors) {
      console.log('Serving from cache');
      return res.json({
        success: true,
        doctors: JSON.parse(cachedDoctors)
      });
    }

    let query = { isVerified: true, isActive: true };

    // Filter by specialty
    if (specialty) {
      query.specialization = new RegExp(specialty, 'i');
    }

    // Search by name or hospital
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { specialization: new RegExp(search, 'i') },
        { 'hospital.name': new RegExp(search, 'i') }
      ];
    }

    // Filter by availability
    if (availability === 'today') {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      query['availability.workingDays'] = today;
    }

    const doctors = await Doctor.find(query)
      .select('-password -__v')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, experience: -1 });

    console.log('DB Query:', JSON.stringify(query));
    console.log('Doctors found:', doctors.length);

    const total = await Doctor.countDocuments(query);

    // Cache results for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify({
      doctors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    }));

    res.json({
      success: true,
      doctors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctorId = req.params.id.trim();
    console.log(`Backend getDoctorById: Requested ID: "${doctorId}" (original: "${req.params.id}")`);
    const doctor = await Doctor.findById(doctorId)
      .select('-password -__v')
      .populate('rating.reviews.patient', 'name');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor works on this day
    if (!doctor.availability.workingDays.includes(dayName)) {
      return res.json({
        success: true,
        availability: []
      });
    }

    // Get booked appointments for the date (excluding cancelled)
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] } // Exclude cancelled appointments
    });

    // Normalize booked slots to 12-hour format for comparison
    const bookedSlots = bookedAppointments.map(apt => {
      // If already in 12-hour format, return as is
      if (apt.timeSlot.includes('AM') || apt.timeSlot.includes('PM')) {
        return apt.timeSlot;
      }
      // Otherwise convert from 24-hour to 12-hour
      return convertTo12HourFormat(apt.timeSlot);
    });

    // Generate available time slots in 24-hour format
    const timeSlots24h = generateTimeSlots(
      doctor.availability.workingHours.start,
      doctor.availability.workingHours.end
    );

    // Convert to 12-hour format and check availability
    const availability = timeSlots24h.map(slot => {
      const slot12h = convertTo12HourFormat(slot);
      return {
        time: slot,
        available: !bookedSlots.includes(slot12h)
      };
    });

    res.json({
      success: true,
      availability
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorPatients = async (req, res, next) => {
  try {
    const doctorId = req.user.id; // Assumes authorized doctor

    // Check if we want ALL patients (registered in the system)
    if (req.query.all === 'true') {
      const allPatients = await import('../models/User.js').then(m => m.default.find({ role: 'patient' }).select('-password -__v'));

      return res.json({
        success: true,
        count: allPatients.length,
        patients: allPatients
      });
    }

    // Find all appointments for this doctor that match the criteria:
    // 1. Payment is 'paid'
    // 2. Status is 'confirmed' or 'completed'
    const appointments = await Appointment.find({
      doctor: doctorId,
      paymentStatus: 'paid',
      status: { $in: ['confirmed', 'completed', 'checked-in', 'in-progress'] }
    })
      .populate('patient', 'name email phone gender dob bloodGroup')
      .sort({ date: -1 }); // Sort by newest first

    // Use a Map to get unique patients
    const patientMap = new Map();

    appointments.forEach(apt => {
      if (apt.patient) {
        const patientId = apt.patient._id.toString();

        if (!patientMap.has(patientId)) {
          // Initialize patient entry
          patientMap.set(patientId, {
            _id: apt.patient._id,
            name: apt.patient.name,
            email: apt.patient.email,
            phone: apt.patient.phone,
            gender: apt.patient.gender,
            dob: apt.patient.dob,
            bloodGroup: apt.patient.bloodGroup,
            lastVisit: null, // Will update below
            totalVisits: 0
          });
        }

        const patient = patientMap.get(patientId);

        // Update stats
        // If appointment is 'completed', it counts as a visit and we track the latest date
        if (apt.status === 'completed') {
          patient.totalVisits += 1;
          // Since we sorted by date desc, the first completed appointment we see is the latest
          if (!patient.lastVisit) {
            patient.lastVisit = apt.date;
          }
        }

        // If the patient has confirmed appointments but no completed ones yet, 
        // they are still in the list, but lastVisit might be null or we could show their next appointment.
        // The requirement implies "visited" dates, so we stick to completed for "Last Visit".
      }
    });

    const patients = Array.from(patientMap.values());

    res.json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorPatientHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    // We could add a check here to ensure the doctor has actually seen this patient, 
    // but for now we'll allow seeing history if the doctor is authenticated.

    // Validate patient exists
    // (Optional, skipped for performance as Appointment find will just return empty if invalid patient ID)

    const appointments = await Appointment.find({
      patient: patientId
    })
      .populate('doctor', 'name specialization hospital')
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password -__v');

    // Clear doctor cache
    const pattern = 'doctors:*';
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let current = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  while (current < end) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
};

// Helper function to convert 24-hour format to 12-hour AM/PM format
const convertTo12HourFormat = (time24) => {
  // Handle formats like "14:00" or "14:00:00"
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const m = minutes || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
};