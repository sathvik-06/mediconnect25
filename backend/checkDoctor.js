import mongoose from 'mongoose';
import Doctor from './models/Doctor.js';
import dotenv from 'dotenv';
dotenv.config();

const checkDoctor = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const doctors = await Doctor.find({});
        console.log('Total Doctors found:', doctors.length);

        doctors.forEach(doc => {
            console.log(`Doctor: ${doc.name}`);
            console.log(`  _id: ${doc._id}`);
            console.log(`  isVerified: ${doc.isVerified} (${typeof doc.isVerified})`);
            console.log(`  isActive: ${doc.isActive} (${typeof doc.isActive})`);
            console.log(`  role: ${doc.role}`);
            console.log('---');
        });

        // specific check for ABCD
        const abcd = doctors.find(d => d.name.includes('ABCD'));
        if (abcd) {
            console.log('Specific check for ABCD:');
            console.log(JSON.stringify(abcd, null, 2));
        } else {
            console.log('Doctor ABCD not found in DB');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkDoctor();
