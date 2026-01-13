// New controller functions for appointment workflow
import Appointment from '../models/Appointment.js';
import { getChannel } from '../config/rabbitmq.js';

// Check-in appointment
// Check-in function removed


// Start consultation
export const startConsultation = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (!['confirmed'].includes(appointment.status)) {
            return res.status(400).json({ success: false, message: 'Appointment must be confirmed' });
        }

        appointment.status = 'in-progress';
        appointment.consultationStartedAt = new Date();
        await appointment.save();
        // Emit real-time update to doctor and patient
        const io = req.app.get('io');
        if (io) {
            io.to(`doctor:${appointment.doctor._id}`).emit('appointmentUpdated', appointment);
            io.to(`user:${appointment.patient._id}`).emit('appointmentUpdated', appointment);
        }

        res.json({
            success: true,
            message: 'Consultation started',
            appointment
        });
    } catch (error) {
        next(error);
    }
};

// Complete consultation
export const completeConsultation = async (req, res, next) => {
    try {
        const { diagnosis, notes, followUpRequired, followUpDate } = req.body;

        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (!['in-progress'].includes(appointment.status)) {
            return res.status(400).json({ success: false, message: 'Appointment must be in-progress' });
        }

        // Calculate duration
        let duration = null;
        if (appointment.consultationStartedAt) {
            duration = Math.round((new Date() - appointment.consultationStartedAt) / (1000 * 60));
        }

        // Update appointment
        appointment.status = 'completed';
        appointment.diagnosis = diagnosis;
        appointment.completionNotes = notes;
        appointment.consultationCompletedAt = new Date();
        appointment.consultationDuration = duration;
        appointment.completedBy = req.user.id;

        if (followUpRequired && followUpDate) {
            appointment.followUpDate = followUpDate;
        }

        await appointment.save();
        // Emit real-time update to doctor and patient
        const io = req.app.get('io');
        if (io) {
            io.to(`doctor:${appointment.doctor._id}`).emit('appointmentUpdated', appointment);
            io.to(`user:${appointment.patient._id}`).emit('appointmentUpdated', appointment);
        }

        // Send notification to patient
        try {
            const channel = getChannel();
            if (channel) {
                channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify({
                    type: 'consultation_completed',
                    userId: appointment.patient._id,
                    data: {
                        doctorName: req.user.name,
                        date: appointment.date.toLocaleDateString(),
                        diagnosis: diagnosis
                    }
                })));
                console.log('Consultation completion notification queued for patient:', appointment.patient._id);
            }
        } catch (notifError) {
            console.error('Error sending completion notification:', notifError);
        }

        res.json({
            success: true,
            message: 'Consultation completed successfully',
            appointment
        });
    } catch (error) {
        next(error);
    }
};

// Mark as no-show
export const markNoShow = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        appointment.status = 'no-show';
        await appointment.save();

        res.json({
            success: true,
            message: 'Marked as no-show',
            appointment
        });
    } catch (error) {
        next(error);
    }
};
