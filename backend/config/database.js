// config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Proactive Sanitization: Remove < and > from password if accidentally included
    if (mongoUri.includes('<') || mongoUri.includes('>')) {
      mongoUri = mongoUri.replace(/<|>/g, '');
    }

    // Ensure database name is included (standardize for this project)
    if (mongoUri.includes('.net/') && !mongoUri.split('.net/')[1].split('?')[0]) {
      const parts = mongoUri.split('?');
      mongoUri = parts[0] + 'mediconnect' + (parts[1] ? '?' + parts[1] : '');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    // Don't exit immediately in production to allow for potential self-healing or log capture
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;