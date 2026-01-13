import mongoose from 'mongoose';
import Doctor from './models/Doctor.js';
import dotenv from 'dotenv';
dotenv.config();

const fixDoctor = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find doctor matching "ABCD"
        const doctor = await Doctor.findOne({
            name: { $regex: 'ABCD', $options: 'i' }
        });

        if (!doctor) {
            console.log('Doctor matching "ABCD" not found');
            return;
        }

        console.log(`Found doctor: ${doctor.name}`);
        console.log('Current status:', {
            isVerified: doctor.isVerified,
            isActive: doctor.isActive,
            availability: doctor.availability
        });

        // Update verified and active status
        doctor.isVerified = true;
        doctor.isActive = true;

        // Ensure some availability is set if missing
        if (!doctor.availability || !doctor.availability.workingDays || doctor.availability.workingDays.length === 0) {
            console.log('Setting default availability');
            doctor.availability = {
                workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                workingHours: {
                    start: "09:00",
                    end: "17:00"
                }
            };
        }

        await doctor.save();
        console.log('Successfully updated doctor status to Verified and Active');
        console.log('New status:', {
            isVerified: doctor.isVerified,
            isActive: doctor.isActive
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

fixDoctor();
