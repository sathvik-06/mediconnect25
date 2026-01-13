import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { getChannel } from '../config/rabbitmq.js';

export const bookAppointment = async (req, res, next) => {
    try {
        const { doctorId, date, timeSlot, type, symptoms, consultationFee } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Normalize date to store only the date part (set time to 00:00:00)
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0);

        // Check availability
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: appointmentDate,
            timeSlot,
            status: { $nin: ['cancelled'] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Time slot already booked'
            });
        }

        const appointment = new Appointment({
            patient: req.user.id,
            doctor: doctorId,
            date: appointmentDate,
            timeSlot,
            type,
            symptoms,
            consultationFee,
            notes: req.body.notes
        });

        await appointment.save();

        // Send notifications
        try {
            const channel = getChannel();
            if (channel) {
                // 1. Notify Doctor (Dashboard)
                channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify({
                    type: 'appointment_booked',
                    userId: doctorId,
                    data: {
                        doctorName: doctor.name,
                        patientName: req.user.name,
                        date: appointmentDate.toLocaleDateString(),
                        time: timeSlot,
                        appointmentId: appointment._id,
                        role: 'doctor'
                    }
                })));

                // 2. Email Patient
                channel.sendToQueue('email_queue', Buffer.from(JSON.stringify({
                    to: req.user.email,
                    subject: 'Appointment Confirmation - MediConnect',
                    template: 'appointment_confirmation',
                    data: {
                        name: req.user.name,
                        doctorName: doctor.name,
                        date: appointmentDate.toLocaleDateString(),
                        time: timeSlot,
                        location: 'MediConnect Hospital'
                    }
                })));

                console.log('Booking notifications queued');
            }
        } catch (notifError) {
            console.error('Error queuing booking notifications:', notifError);
            // Don't fail the request
        }

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        next(error);
    }
};

export const getPatientAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
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

export const getDoctorAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name email phone')
            .sort({ date: 1 });

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        next(error);
    }
};

export const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify ownership
        if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({
            success: true,
            message: 'Appointment status updated',
            appointment
        });
    } catch (error) {
        next(error);
    }
};

export const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this appointment'
            });
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Appointment is already cancelled'
            });
        }

        // For patients, enforce 3-hour cancellation policy
        if (req.user.role === 'patient') {
            const appointmentDate = new Date(appointment.date);
            const timeStr = appointment.timeSlot.split(' - ')[0];

            // Handle AM/PM format
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
                const isPM = timeStr.includes('PM');
                const cleanTime = timeStr.replace(/AM|PM/g, '').trim();
                let [hours, minutes] = cleanTime.split(':').map(Number);

                if (isPM && hours !== 12) hours += 12;
                else if (!isPM && hours === 12) hours = 0;

                appointmentDate.setHours(hours, minutes, 0, 0);
            } else {
                const [hours, minutes] = timeStr.split(':').map(Number);
                appointmentDate.setHours(hours, minutes, 0, 0);
            }

            const now = new Date();
            const timeDifferenceHours = (appointmentDate - now) / (1000 * 60 * 60);

            if (timeDifferenceHours < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointments cannot be cancelled within 3 hours of the scheduled time'
                });
            }
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = req.body.reason || 'Cancelled by user';
        await appointment.save();

        // Populate appointment details for notification
        await appointment.populate('patient', 'name');
        await appointment.populate('doctor', 'name');

        // Send notification to doctor if patient cancelled
        if (req.user.role === 'patient') {
            try {
                const channel = getChannel();
                if (channel) {
                    channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify({
                        type: 'appointment_cancelled',
                        userId: appointment.doctor._id,
                        data: {
                            patientName: appointment.patient.name,
                            date: appointment.date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }),
                            time: appointment.timeSlot,
                            reason: appointment.cancellationReason
                        }
                    })));
                }
            } catch (notifError) {
                console.error('Error sending cancellation notification:', notifError);
                // Don't fail the request if notification fails
            }
        }

        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment
        });
    } catch (error) {
        next(error);
    }
};
