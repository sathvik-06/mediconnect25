import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import { generateToken } from './utils/jwt.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

const API_URL = 'http://localhost:5000/api';

async function verifyFixes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // 1. Create Test Patient
        const testEmail = `testpatient_${Date.now()}@example.com`;
        const testPassword = 'password123';

        console.log(`Creating test patient: ${testEmail}`);
        const patient = new Patient({
            name: 'Test Patient',
            email: testEmail,
            password: testPassword,
            role: 'patient',
            phone: '1234567890',
            dateOfBirth: new Date(),
            gender: 'male'
        });
        await patient.save();
        console.log('Test patient created.');

        // 2. Login to get token
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: testPassword,
            role: 'patient'
        });
        const token = loginRes.data.token;
        console.log('Login successful, token received.');

        const headers = { Authorization: `Bearer ${token}` };

        // 3. Test Find Doctors
        console.log('Testing Find Doctors...');
        try {
            const doctorsRes = await axios.get(`${API_URL}/doctors`, { headers });
            console.log(`Find Doctors success. Found ${doctorsRes.data.doctors.length} doctors.`);
        } catch (err) {
            console.error('Find Doctors failed:', err.response?.data || err.message);
        }

        // 4. Test Medical History
        console.log('Testing Medical History endpoints...');
        try {
            const apptRes = await axios.get(`${API_URL}/medical-history/appointments`, { headers });
            console.log(`Appointments history success. Found ${apptRes.data.appointments.length} appointments.`);

            const presRes = await axios.get(`${API_URL}/medical-history/prescriptions`, { headers });
            console.log(`Prescriptions history success. Found ${presRes.data.prescriptions.length} prescriptions.`);

            const reportRes = await axios.get(`${API_URL}/medical-history/reports`, { headers });
            console.log(`Reports history success. Found ${reportRes.data.reports.length} reports.`);
        } catch (err) {
            console.error('Medical History endpoints failed:', err.response?.data || err.message);
        }

        // 5. Test Upload Prescription (Expect failure if Cloudinary not set)
        console.log('Testing Upload Prescription...');
        try {
            // Create a dummy jpg file
            const dummyFilePath = path.join(process.cwd(), 'dummy.jpg');
            fs.writeFileSync(dummyFilePath, Buffer.from('fake image data'));

            const formData = new FormData();
            formData.append('prescription', fs.createReadStream(dummyFilePath));

            const uploadRes = await axios.post(`${API_URL}/prescriptions/upload`, formData, {
                headers: {
                    ...headers,
                    ...formData.getHeaders()
                }
            });
            console.log('Upload Prescription success:', uploadRes.data);

            fs.unlinkSync(dummyFilePath);
        } catch (err) {
            console.error('Upload Prescription failed (Expected if Cloudinary missing):', err.response?.data || err.message);
            if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
        }

        // Cleanup
        console.log('Cleaning up test user...');
        await User.findByIdAndDelete(patient._id);
        console.log('Done.');

    } catch (error) {
        console.error('Verification script failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyFixes();
