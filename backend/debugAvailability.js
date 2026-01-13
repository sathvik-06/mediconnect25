
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';
import './models/Patient.js';

dotenv.config();

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('debug_avail_out.txt', msg + '\n');
};

const debugAvailability = async () => {
    fs.writeFileSync('debug_avail_out.txt', '--- START ---\n');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        log('Connected to MongoDB');

        const doctorId = '69342c6b800106e50f34e17b'; // Doctor ABCD
        const testDate = '2025-12-07'; // Sunday

        log(`Checking availability for Doctor: ${doctorId} on ${testDate}`);

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            log('Doctor not found');
            return;
        }
        log(`Doctor Name: ${doctor.name}`);
        log(`Working Days: ${JSON.stringify(doctor.availability.workingDays)}`);
        log(`Working Hours: ${JSON.stringify(doctor.availability.workingHours)}`);

        const selectedDate = new Date(testDate);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        log(`Requested Day: ${dayName}`);

        if (!doctor.availability.workingDays.includes(dayName)) {
            log('!! Doctor does not work on this day !!');
        } else {
            log('Doctor works on this day.');
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['scheduled', 'confirmed'] }
        });

        log(`Booked Appointments: ${bookedAppointments.length}`);
        const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);
        log(`Booked Slots: ${JSON.stringify(bookedSlots)}`);

        // Generate Slots
        const slots = [];
        const startTime = doctor.availability.workingHours.start;
        const endTime = doctor.availability.workingHours.end;

        // Safety check
        if (!startTime || !endTime) {
            log('Start or End time missing!');
        } else {
            let current = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);

            while (current < end) {
                slots.push(current.toTimeString().slice(0, 5));
                current.setMinutes(current.getMinutes() + 30);
            }

            log(`Generated Slots Count: ${slots.length}`);

            const finalAvailability = slots.map(slot => ({
                time: slot,
                available: !bookedSlots.includes(slot)
            }));

            log('--- Final Map ---');
            finalAvailability.forEach(s => {
                log(`${s.time}: ${s.available ? 'AVAILABLE' : 'BOOKED'}`);
            });
        }

    } catch (error) {
        log(`Error: ${error.message}`);
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

debugAvailability();
