import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendEmail } from '../queues/emailQueue.js';

export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d'
    });

    return { accessToken, refreshToken };
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const sendWelcomeEmail = async (user) => {
    await sendEmail({
        to: user.email,
        subject: 'Welcome to MediConnect',
        template: 'welcome',
        context: {
            name: user.name,
            role: user.role
        }
    });
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        template: 'reset-password',
        context: {
            resetLink
        }
    });
};

export const verifyEmail = async (token) => {
    // Implementation for email verification logic
    // This would typically involve decoding the token and updating the user's isVerified status
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.isVerified = true;
        await user.save();

        return true;
    } catch (error) {
        throw new Error('Invalid or expired verification token');
    }
};
