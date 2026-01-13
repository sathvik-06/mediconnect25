import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const cleanupAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all admin users
        const admins = await User.find({ role: 'admin' });

        console.log(`\nFound ${admins.length} admin account(s):`);
        admins.forEach((admin, index) => {
            console.log(`${index + 1}. Email: ${admin.email}, Name: ${admin.name}, ID: ${admin._id}`);
        });

        if (admins.length <= 1) {
            console.log('\nOnly one admin exists. No cleanup needed.');
            process.exit(0);
        }

        // Keep only the admin@mediconnect.com account
        const mainAdminEmail = 'admin@mediconnect.com';
        const adminsToDelete = admins.filter(admin => admin.email !== mainAdminEmail);

        console.log(`\n⚠️  Will delete ${adminsToDelete.length} admin account(s):`);
        adminsToDelete.forEach(admin => {
            console.log(`   - ${admin.email} (${admin.name})`);
        });

        console.log(`\n✅ Will keep: ${mainAdminEmail}`);

        // Delete the extra admins
        for (const admin of adminsToDelete) {
            await User.findByIdAndDelete(admin._id);
            console.log(`✅ Deleted: ${admin.email}`);
        }

        console.log(`\n✅ Cleanup complete! Only 1 admin remains.`);

        // Verify
        const remainingAdmins = await User.find({ role: 'admin' });
        console.log(`\nVerification: ${remainingAdmins.length} admin account(s) remaining:`);
        remainingAdmins.forEach(admin => {
            console.log(`   - ${admin.email} (${admin.name})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanupAdmins();
