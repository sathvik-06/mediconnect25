import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import Medicine from './models/Medicine.js';
import Order from './models/Order.js';
import Patient from './models/Patient.js';
import User from './models/User.js';

const seedData = async () => {
    try {
        await connectDB();
        console.log('Database connected...');

        // 1. Seed Medicines (Inventory)
        await Medicine.deleteMany({}); // Optional: clear existing
        console.log('Cleared existing medicines...');

        const medicines = [
            {
                name: 'Paracetamol',
                manufacturer: 'GSK',
                category: 'analgesic',
                form: 'tablet',
                strength: '500mg',
                price: 5.00,
                stock: 500,
                expiryDate: new Date('2025-12-31'),
                description: 'For fever and pain relief.',
                composition: 'Paracetamol 500mg'
            },
            {
                name: 'Amoxicillin',
                manufacturer: 'Pfizer',
                category: 'antibiotic',
                form: 'capsule',
                strength: '250mg',
                price: 12.50,
                stock: 200,
                expiryDate: new Date('2024-06-30'),
                description: 'Broad spectrum antibiotic.',
                composition: 'Amoxicillin 250mg'
            },
            {
                name: 'Ibuprofen',
                manufacturer: 'Abbott',
                category: 'analgesic',
                form: 'tablet',
                strength: '400mg',
                price: 4.00,
                stock: 50,
                expiryDate: new Date('2025-01-15'),
                description: 'Anti-inflammatory.',
                composition: 'Ibuprofen 400mg'
            },
            {
                name: 'Cetirizine',
                manufacturer: 'Cipla',
                category: 'antihistamine',
                form: 'tablet',
                strength: '10mg',
                price: 3.00,
                stock: 300,
                expiryDate: new Date('2024-11-20'),
                description: 'Allergy relief.',
                composition: 'Cetirizine 10mg'
            },
            {
                name: 'Metformin',
                manufacturer: 'Sun Pharma',
                category: 'diabetes',
                form: 'tablet',
                strength: '500mg',
                price: 8.00,
                stock: 150,
                expiryDate: new Date('2026-03-10'),
                description: 'Type 2 diabetes management.',
                composition: 'Metformin 500mg'
            }
        ];

        const createdMedicines = await Medicine.insertMany(medicines);
        console.log(`Seeded ${createdMedicines.length} medicines.`);

        // 2. Find or Create a Patient
        let patient = await Patient.findOne();
        if (!patient) {
            // Check User collection first
            let user = await User.findOne({ role: 'patient' });
            if (!user) {
                // creating user... actually Patient model might be separate or discriminator
                // Looking at User.js, it has discriminator. Patient.js likely uses it.
                // But let's verify if Patient.js exports a model based on User.
                // Assuming Patient model works.
                console.log('No patient found, skipping order creation (or create a dummy one if needed).');
                // Creating a dummy user for orders
                patient = await User.create({
                    name: "Test Patient",
                    email: "patient@example.com",
                    password: "password123",
                    role: "patient",
                    phone: "1234567890"
                });
            } else {
                patient = user;
            }
        }
        console.log(`Using patient: ${patient.name}`);

        // 3. Seed Orders (Orders & Payments)
        await Order.deleteMany({});
        console.log('Cleared existing orders...');

        const orders = [
            {
                patient: patient._id,
                medicines: [
                    { medicineId: createdMedicines[0]._id, quantity: 2, price: 5.00 },
                    { medicineId: createdMedicines[2]._id, quantity: 1, price: 4.00 }
                ],
                totalAmount: 14.00,
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: 'card',
                deliveryAddress: {
                    name: patient.name,
                    street: "123 Main St",
                    city: "Metro City",
                    state: "State",
                    zipCode: "10001",
                    phone: "1234567890"
                },
                createdAt: new Date()
            },
            {
                patient: patient._id,
                medicines: [
                    { medicineId: createdMedicines[1]._id, quantity: 1, price: 12.50 }
                ],
                totalAmount: 12.50,
                status: 'processing',
                paymentStatus: 'paid', // This should show up in payments
                paymentMethod: 'upi',
                deliveryAddress: {
                    name: patient.name,
                    street: "123 Main St",
                    city: "Metro City",
                    state: "State",
                    zipCode: "10001",
                    phone: "1234567890"
                },
                createdAt: new Date(Date.now() - 86400000) // Yesterday
            },
            {
                patient: patient._id,
                medicines: [
                    { medicineId: createdMedicines[3]._id, quantity: 3, price: 3.00 },
                    { medicineId: createdMedicines[0]._id, quantity: 1, price: 5.00 }
                ],
                totalAmount: 14.00,
                status: 'delivered',
                paymentStatus: 'paid',
                paymentMethod: 'card',
                deliveryAddress: {
                    name: patient.name,
                    street: "123 Main St",
                    city: "Metro City",
                    state: "State",
                    zipCode: "10001",
                    phone: "1234567890"
                },
                createdAt: new Date(Date.now() - 172800000) // 2 days ago
            },
            {
                patient: patient._id,
                medicines: [
                    { medicineId: createdMedicines[4]._id, quantity: 2, price: 8.00 }
                ],
                totalAmount: 16.00,
                status: 'cancelled',
                paymentStatus: 'refunded',
                paymentMethod: 'netbanking',
                deliveryAddress: {
                    name: patient.name,
                    street: "123 Main St",
                    city: "Metro City",
                    state: "State",
                    zipCode: "10001",
                    phone: "1234567890"
                },
                createdAt: new Date(Date.now() - 259200000) // 3 days ago
            }
        ];

        await Order.insertMany(orders);
        console.log(`Seeded ${orders.length} orders.`);

        mongoose.connection.close();
        console.log('Done!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
