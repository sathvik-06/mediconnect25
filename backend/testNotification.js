// Test script to create a notification directly
import mongoose from 'mongoose';
import Notification from './models/Notification.js';
import 'dotenv/config';

const testNotification = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const notification = new Notification({
            user: '692f00cb1c7dbf8a8f600c3f', // Patient ID from logs
            type: 'test_notification',
            title: 'Test Notification',
            message: 'This is a test notification to verify the system works',
            data: { test: true }
        });

        await notification.save();
        console.log('Notification created:', notification);

        const count = await Notification.countDocuments({ user: '692f00cb1c7dbf8a8f600c3f' });
        console.log(`Total notifications for user: ${count}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testNotification();
