
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';

dotenv.config();

const debugDoctor = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // ID found in the previous debug output
        const targetId = '69342c6b800106e50f34e17b';

        console.log(`Attempting to find Doctor by ID: "${targetId}"`);

        // Try findById
        const docById = await Doctor.findById(targetId);
        console.log('findById result:', docById ? 'FOUND' : 'NOT FOUND');
        if (docById) console.log('Role:', docById.role);

        // Try findOne with _id
        const docOne = await Doctor.findOne({ _id: targetId });
        console.log('findOne result:', docOne ? 'FOUND' : 'NOT FOUND');

        // Try finding ALL doctors and checking IDs
        const all = await Doctor.find({});
        console.log('Total doctors in DB:', all.length);
        all.forEach(d => {
            console.log(`Doc: ${d._id} (Role: ${d.role}) - Match? ${d._id.toString() === targetId}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugDoctor();
