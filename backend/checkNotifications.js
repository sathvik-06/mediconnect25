// Test script to check notifications in database
import mongoose from 'mongoose';
import Notification from './models/Notification.js';
import 'dotenv/config';

const checkNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Count total notifications
        const total = await Notification.countDocuments();
        console.log(`Total notifications: ${total}`);

        const patientId = '692f00cb1c7dbf8a8f600c3f';
        const patientNotifs = await Notification.countDocuments({ user: patientId });
        console.log(`Notifications for patient ID ${patientId}: ${patientNotifs}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkNotifications();
