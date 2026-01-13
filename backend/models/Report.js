// models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    fileName: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Report', reportSchema);
