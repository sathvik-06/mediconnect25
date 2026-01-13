import mongoose from 'mongoose';
import User from './User.js';

const pharmacySchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    pharmacyName: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    phone: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        reviews: [{
            patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            createdAt: { type: Date, default: Date.now }
        }]
    }
});

export default User.discriminator('pharmacist', pharmacySchema);
