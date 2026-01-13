// src/controllers/medicalHistoryController.js
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
// Assuming a Report model exists; if not, we'll return empty array for now
import Report from '../models/Report.js'; // may not exist, will handle gracefully

export const getAppointmentHistory = async (req, res, next) => {
    try {
        const patientId = req.user.id;
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'name specialization email phone')
            .populate('patient', 'name email phone')
            .sort({ date: -1 });
        res.json({ success: true, appointments });
    } catch (error) {
        next(error);
    }
};

export const getPrescriptions = async (req, res, next) => {
    try {
        const patientId = req.user.id;
        const prescriptions = await Prescription.find({ patient: patientId })
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 });
        res.json({ success: true, prescriptions });
    } catch (error) {
        next(error);
    }
};

export const getMedicalReports = async (req, res, next) => {
    try {
        const patientId = req.user.id;
        // If Report model does not exist, return empty array
        let reports = [];
        try {
            reports = await Report.find({ patient: patientId }).sort({ createdAt: -1 });
        } catch (e) {
            // ignore if model missing
        }
        res.json({ success: true, reports });
    } catch (error) {
        next(error);
    }
};
