import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';

dotenv.config();

const updateDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all doctors that are missing required fields
        const doctors = await Doctor.find({ role: 'doctor' });

        console.log(`Found ${doctors.length} doctors`);

        for (const doctor of doctors) {
            let needsUpdate = false;

            // Check and fill missing required fields
            if (!doctor.specialization) {
                doctor.specialization = 'General Medicine';
                needsUpdate = true;
                console.log(`Adding specialization for ${doctor.name}`);
            }

            if (!doctor.experience && doctor.experience !== 0) {
                doctor.experience = 5;
                needsUpdate = true;
                console.log(`Adding experience for ${doctor.name}`);
            }

            if (!doctor.licenseNumber) {
                // Generate a unique license number
                doctor.licenseNumber = `MED${Date.now()}${Math.floor(Math.random() * 1000)}`;
                needsUpdate = true;
                console.log(`Adding license number for ${doctor.name}: ${doctor.licenseNumber}`);
            }

            if (!doctor.consultationFee && doctor.consultationFee !== 0) {
                doctor.consultationFee = 500;
                needsUpdate = true;
                console.log(`Adding consultation fee for ${doctor.name}`);
            }

            if (needsUpdate) {
                await doctor.save();
                console.log(`✓ Updated ${doctor.name} (${doctor.email})`);
            } else {
                console.log(`✓ ${doctor.name} already has all required fields`);
            }
        }

        console.log('\n✅ All doctors updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error updating doctors:', error);
        process.exit(1);
    }
};

updateDoctors();
