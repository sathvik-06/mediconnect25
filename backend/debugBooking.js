
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Appointment from './models/Appointment.js';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';
import User from './models/User.js';
// We need to simulate the controller, NOT a full HTTP request for now, or just use HTTP?
// HTTP is better to test middleware.
// But I don't have a valid JWT token generator easily handy without login.
// Actually I can mock req/res and call the controller directly if I connect to DB.
// Let's try HTTP with a dummy token? No, middleware will fail.

// Strategy:
// 1. Connect DB.
// 2. Find a patient user.
// 3. Find doctor ABCD.
// 4. Call bookAppointment controller function directly with mocked req/res.

import { bookAppointment } from './controllers/appointmentController.js';

dotenv.config();

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('debug_booking_out.txt', msg + '\n');
};

const debugBooking = async () => {
    fs.writeFileSync('debug_booking_out.txt', '--- START DEBUG BOOKING ---\n');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        log('Connected to MongoDB');

        // 1. Find Doctor
        const doctor = await Doctor.findOne({ name: 'ABCD' });
        if (!doctor) {
            log('Doctor ABCD not found!');
            return;
        }
        log(`Doctor Found: ${doctor._id}`);

        // 2. Find a Patient
        // We need a user with role 'patient'
        const patient = await User.findOne({ role: 'patient' });
        if (!patient) {
            log('No patient user found! Cannot test booking.');
            // Try creating one?
            return;
        }
        log(`Patient Found: ${patient._id} (${patient.name})`);

        // 3. Mock Req/Res
        const req = {
            body: {
                doctorId: doctor._id.toString(),
                date: '2025-12-07',
                timeSlot: '09:00', // Matches backend format
                type: 'in-person',
                symptoms: 'Debug test symptoms',
                consultationFee: doctor.consultationFee
            },
            user: {
                id: patient._id.toString(),
                role: 'patient'
            }
        };

        const res = {
            status: (code) => {
                log(`Response Status: ${code}`);
                return res;
            },
            json: (data) => {
                log(`Response JSON: ${JSON.stringify(data, null, 2)}`);
                return res;
            }
        };

        const next = (err) => {
            log(`ERROR (Next): ${err.message}`);
            log(err.stack);
        };

        log('Calling bookAppointment controller...');
        await bookAppointment(req, res, next);

    } catch (err) {
        log(`CRITICAL ERROR: ${err.message}`);
        log(err.stack);
    } finally {
        await mongoose.disconnect();
    }
};

debugBooking();
