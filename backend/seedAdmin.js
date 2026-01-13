import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@mediconnect.com';
        const adminPassword = 'adminpassword123';

        // Check if admin exists and delete it to recreate
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Existing admin found, deleting...');
            await existingAdmin.deleteOne();
            console.log('Existing admin deleted');
        }

        const adminUser = new User({
            name: 'Super Admin',
            
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isActive: true,
            isVerified: true
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();

// to get the admin portal http://localhost:3000/admin-portal-secure/login
// or node seedAdmin.js in terminal