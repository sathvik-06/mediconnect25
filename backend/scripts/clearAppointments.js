import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import dotenv from 'dotenv';

dotenv.config();

const clearTestAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete all appointments for testing
        const result = await Appointment.deleteMany({});
        console.log(`Deleted ${result.deletedCount} appointments`);

        await mongoose.connection.close();
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearTestAppointments();
