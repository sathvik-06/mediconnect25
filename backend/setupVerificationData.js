import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';

dotenv.config();

const setupVerificationData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create Test Doctor
        const doctorEmail = 'verify_doc@example.com';
        await User.deleteOne({ email: doctorEmail });

        const doctor = new Doctor({
            name: 'Dr. Verifier',
            email: doctorEmail,
            password: 'password123',
            role: 'doctor',
            specialization: 'General',
            experience: 10,
            licenseNumber: 'VERIFY123',
            consultationFee: 100,
            isVerified: true,
            isActive: true,
            availability: {
                workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                workingHours: {
                    start: '09:00',
                    end: '17:00'
                }
            }
        });
        await doctor.save();
        console.log('Test Doctor created:', doctorEmail);

        // 2. Create Patient 1 (Visited) - Logic: We don't link them via appointment this time to prove "All" works
        const p1Email = 'p1_notvisited@example.com';
        await User.deleteOne({ email: p1Email });
        const p1 = new Patient({
            name: 'Patient One Unvisited',
            email: p1Email,
            password: 'password123',
            role: 'patient',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'male'
        });
        await p1.save();

        // 3. Create Patient 2 (Also Unvisited)
        const p2Email = 'p2_notvisited@example.com';
        await User.deleteOne({ email: p2Email });
        const p2 = new Patient({
            name: 'Patient Two Unvisited',
            email: p2Email,
            password: 'password123',
            role: 'patient',
            dateOfBirth: new Date('1992-01-01'),
            gender: 'female'
        });
        await p2.save();

        console.log('Created 2 unvisited patients. If they show up, "All" works.');
        process.exit(0);
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
};

setupVerificationData();
