import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testAdminLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@mediconnect.com';
        const testPassword = 'adminpassword123';

        // Find admin
        const admin = await User.findOne({ email: adminEmail, role: 'admin' }).select('+password');

        if (!admin) {
            console.log('❌ Admin not found');
            process.exit(1);
        }

        console.log('✅ Admin found:');
        console.log('  ID:', admin._id);
        console.log('  Name:', admin.name);
        console.log('  Email:', admin.email);
        console.log('  Role:', admin.role);
        console.log('  Is Active:', admin.isActive);
        console.log('  Is Verified:', admin.isVerified);
        console.log('  Password Hash:', admin.password.substring(0, 20) + '...');

        // Test password
        console.log('\nTesting password...');
        const isMatch = await admin.comparePassword(testPassword);
        console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');

        if (!isMatch) {
            console.log('Password mismatch!');
            process.exit(1);
        }

        // Simulate lastLogin update and save (which happens in controller)
        console.log('\nSimulating lastLogin update and save...');
        try {
            admin.lastLogin = new Date();
            await admin.save();
            console.log('✅ User saved successfully');
        } catch (saveError) {
            console.error('❌ Error saving user:', saveError);
            // Log validation errors if any
            if (saveError.errors) {
                Object.keys(saveError.errors).forEach(key => {
                    console.error(`  - ${key}: ${saveError.errors[key].message}`);
                });
            }
        }



        // Test Token Generation
        console.log('\nTesting Token Generation...');
        if (!process.env.JWT_SECRET) {
            console.error('❌ JWT_SECRET is missing in environment variables!');
        } else {
            console.log('✅ JWT_SECRET is present');
        }

        try {
            // We need to import these dynamically or mock them if they are simple
            // Since they are in utils/tokenUtils.js, let's try to import them
            const { generateToken, generateRefreshToken } = await import('./utils/tokenUtils.js');

            const token = generateToken(admin._id);
            console.log('✅ Access Token generated successfully');

            const refreshToken = generateRefreshToken(admin._id);
            console.log('✅ Refresh Token generated successfully');
        } catch (tokenError) {
            console.error('❌ Error generating tokens:', tokenError);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testAdminLogin();
