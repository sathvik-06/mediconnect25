// models/VideoRoom.js
import mongoose from 'mongoose';

const videoRoomSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        socketId: String,
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'ended'],
        default: 'active'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: Date
}, {
    timestamps: true
});

// Index for efficient queries
videoRoomSchema.index({ appointmentId: 1 });
videoRoomSchema.index({ roomId: 1 });
videoRoomSchema.index({ status: 1 });

export default mongoose.model('VideoRoom', videoRoomSchema);
