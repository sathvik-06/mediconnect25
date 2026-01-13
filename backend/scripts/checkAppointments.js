import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Get all appointments for Dec 12, 2025
        const appointments = await Appointment.find({
            date: {
                $gte: new Date('2025-12-12T00:00:00'),
                $lte: new Date('2025-12-12T23:59:59')
            }
        })
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization')
            .sort({ timeSlot: 1 });

        console.log(`Found ${appointments.length} appointments for December 12, 2025:\n`);
        console.log('='.repeat(100));

        appointments.forEach((apt, index) => {
            console.log(`\n${index + 1}. Time Slot: ${apt.timeSlot}`);
            console.log(`   Status: ${apt.status}`);
            console.log(`   Patient: ${apt.patient?.name || 'N/A'} (${apt.patient?.email || 'N/A'})`);
            console.log(`   Doctor: Dr. ${apt.doctor?.name || 'N/A'} (${apt.doctor?.specialization || 'N/A'})`);
            console.log(`   Booked on: ${apt.createdAt}`);
            console.log(`   Appointment ID: ${apt._id}`);
        });

        console.log('\n' + '='.repeat(100));
        console.log(`\nSummary:`);
        console.log(`Total appointments: ${appointments.length}`);
        console.log(`Scheduled: ${appointments.filter(a => a.status === 'scheduled').length}`);
        console.log(`Confirmed: ${appointments.filter(a => a.status === 'confirmed').length}`);
        console.log(`Cancelled: ${appointments.filter(a => a.status === 'cancelled').length}`);
        console.log(`Completed: ${appointments.filter(a => a.status === 'completed').length}`);

        await mongoose.connection.close();
        console.log('\nDone!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAppointments();
