import mongoose from 'mongoose';
import Doctor from './models/Doctor.js';
import dotenv from 'dotenv';
dotenv.config();

const debugQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Simulate the query from the controller
        const query = { isVerified: true, isActive: true };
        console.log('Testing Query:', JSON.stringify(query));

        const doctors = await Doctor.find(query);
        console.log(`Doctors found with query: ${doctors.length}`);

        doctors.forEach(d => {
            console.log(`- ${d.name} (Verified: ${d.isVerified}, Active: ${d.isActive})`);
        });

        // Debug specific doctor
        const abcd = await Doctor.findOne({ name: { $regex: 'ABCD', $options: 'i' } });
        if (abcd) {
            console.log('\nDetailed check for ABCD:');
            console.log(`isVerified: ${abcd.isVerified} (Type: ${typeof abcd.isVerified})`);
            console.log(`isActive: ${abcd.isActive} (Type: ${typeof abcd.isActive})`);
            console.log('Matches Query?', (abcd.isVerified === true && abcd.isActive === true));
        } else {
            console.log('\nDoctor ABCD not found via direct find');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

debugQuery();
