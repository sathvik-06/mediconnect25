import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';
import VideoRoom from './models/VideoRoom.js';
import { createVideoRoom } from './controllers/videoController.js';

dotenv.config();

const testVideoFlow = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create Test Doctor
        const doctorEmail = 'testdoc_video@example.com';
        await User.deleteOne({ email: doctorEmail });

        const doctor = new Doctor({
            name: 'Test Doctor Video',
            email: doctorEmail,
            password: 'password123',
            role: 'doctor',
            specialization: 'General',
            experience: 5,
            licenseNumber: 'DOC123VIDEO',
            consultationFee: 50,
            isVerified: true,
            isActive: true
        });
        await doctor.save();
        console.log('Test Doctor created:', doctor._id);

        // 2. Create Test Patient
        const patientEmail = 'testpat_video@example.com';
        await User.deleteOne({ email: patientEmail });

        const patient = new Patient({
            name: 'Test Patient Video',
            email: patientEmail,
            password: 'password123',
            role: 'patient',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'male'
        });
        await patient.save();
        console.log('Test Patient created:', patient._id);

        // 3. Create Appointment
        const appointment = new Appointment({
            doctor: doctor._id,
            patient: patient._id,
            date: new Date(),
            timeSlot: '10:00',
            type: 'video',
            status: 'confirmed',
            consultationFee: 50,
            paymentStatus: 'paid'
        });
        await appointment.save();
        console.log('Test Appointment created:', appointment._id);

        // 4. Mock Request/Response for Controller
        const req = {
            body: { appointmentId: appointment._id },
            user: { id: patient._id.toString() }
        };

        const res = {
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.data = data;
                return this;
            }
        };

        const next = (err) => {
            if (err) {
                console.error('Controller Error Details:', err);
                console.error('Stack:', err.stack);
            }
        };

        // 5. Call createVideoRoom controller directly
        console.log('Testing createVideoRoom controller...');
        try {
            await createVideoRoom(req, res, next);
        } catch (e) {
            console.error('Exception calling controller:', e);
        }

        if (res.data && res.data.success) {
            console.log('SUCCESS: Video room created successfully!');
            console.log('Room ID:', res.data.room.roomId);
        } else {
            console.error('FAILURE: Could not create video room');
            console.error('Response:', res.data);
        }

        // Cleanup
        await Appointment.deleteOne({ _id: appointment._id });
        await User.deleteOne({ _id: doctor._id });
        await User.deleteOne({ _id: patient._id });
        if (res.data && res.data.room) {
            await VideoRoom.deleteOne({ roomId: res.data.room.roomId });
        }
        console.log('Cleanup completed');

        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
};

testVideoFlow();
