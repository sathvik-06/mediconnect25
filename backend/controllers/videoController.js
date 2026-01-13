// controllers/videoController.js
import { v4 as uuidv4 } from 'uuid';
import VideoRoom from '../models/VideoRoom.js';
import Appointment from '../models/Appointment.js';

// @desc    Create a video room for an appointment
// @route   POST /api/video/create-room
// @access  Private (Patient or Doctor)
export const createVideoRoom = async (req, res, next) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user.id;

        // Check if appointment exists
        const appointment = await Appointment.findById(appointmentId)
            .populate('patient', 'name email')
            .populate('doctor', 'name email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify user is either the patient or doctor
        const isPatient = appointment.patient._id.toString() === userId;
        const isDoctor = appointment.doctor._id.toString() === userId;

        if (!isPatient && !isDoctor) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this appointment'
            });
        }

        // Check if appointment type is video
        if (appointment.type !== 'video') {
            return res.status(400).json({
                success: false,
                message: 'This appointment is not scheduled for video consultation'
            });
        }

        // Check if appointment is confirmed
        if (appointment.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Appointment must be confirmed before starting video consultation'
            });
        }

        // Check if room already exists
        let videoRoom = await VideoRoom.findOne({ appointmentId });

        if (videoRoom && videoRoom.status === 'active') {
            return res.json({
                success: true,
                message: 'Video room already exists',
                room: {
                    roomId: videoRoom.roomId,
                    appointmentId: videoRoom.appointmentId,
                    participants: videoRoom.participants
                }
            });
        }

        // Create new room
        const roomId = uuidv4();
        videoRoom = new VideoRoom({
            appointmentId,
            roomId,
            createdBy: userId,
            participants: [{
                userId,
                joinedAt: new Date()
            }]
        });

        await videoRoom.save();

        // Update appointment with meeting link (optional - for reference)
        appointment.meetingLink = `/video/${appointmentId}`;
        await appointment.save();

        res.status(201).json({
            success: true,
            message: 'Video room created successfully',
            room: {
                roomId: videoRoom.roomId,
                appointmentId: videoRoom.appointmentId,
                appointment: {
                    patient: {
                        id: appointment.patient._id,
                        name: appointment.patient.name
                    },
                    doctor: {
                        id: appointment.doctor._id,
                        name: appointment.doctor.name
                    },
                    date: appointment.date,
                    timeSlot: appointment.timeSlot
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get video room details
// @route   GET /api/video/room/:appointmentId
// @access  Private (Patient or Doctor)
export const getVideoRoom = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;

        const appointment = await Appointment.findById(appointmentId)
            .populate('patient', 'name email')
            .populate('doctor', 'name email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify authorization
        const isPatient = appointment.patient._id.toString() === userId;
        const isDoctor = appointment.doctor._id.toString() === userId;

        if (!isPatient && !isDoctor) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this appointment'
            });
        }

        const videoRoom = await VideoRoom.findOne({ appointmentId });

        if (!videoRoom) {
            return res.status(404).json({
                success: false,
                message: 'Video room not found. Create a room first.'
            });
        }

        res.json({
            success: true,
            room: {
                roomId: videoRoom.roomId,
                status: videoRoom.status,
                participants: videoRoom.participants,
                appointment: {
                    patient: {
                        id: appointment.patient._id,
                        name: appointment.patient.name
                    },
                    doctor: {
                        id: appointment.doctor._id,
                        name: appointment.doctor.name
                    },
                    date: appointment.date,
                    timeSlot: appointment.timeSlot
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    End video room
// @route   POST /api/video/end-room
// @access  Private (Patient or Doctor)
export const endVideoRoom = async (req, res, next) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user.id;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify authorization
        const isPatient = appointment.patient.toString() === userId;
        const isDoctor = appointment.doctor.toString() === userId;

        if (!isPatient && !isDoctor) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to end this video room'
            });
        }

        const videoRoom = await VideoRoom.findOne({ appointmentId });

        if (!videoRoom) {
            return res.status(404).json({
                success: false,
                message: 'Video room not found'
            });
        }

        videoRoom.status = 'ended';
        videoRoom.endedAt = new Date();
        await videoRoom.save();

        // Optionally update appointment status
        if (appointment.status === 'confirmed') {
            appointment.status = 'completed';
            await appointment.save();
        }

        res.json({
            success: true,
            message: 'Video room ended successfully'
        });
    } catch (error) {
        next(error);
    }
};
