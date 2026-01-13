// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Database connections
import connectDB from './config/database.js';
import redisClient, { connectRedis } from './config/redis.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { startEmailWorker } from './queues/workers/emailWorker.js';
import { startNotificationWorker } from './queues/workers/notificationWorker.js';


// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import prescriptionRoutes from './routes/prescriptions.js';
import pharmacyRoutes from './routes/pharmacy.js';
import notificationRoutes from './routes/notifications.js';
import reminderRoutes from './routes/reminders.js';
import uploadRoutes from './routes/uploads.js';
import analyticsRoutes from './routes/analytics.js';
import contactRoutes from './routes/contact.js';
import medicalHistoryRoutes from './routes/medicalHistory.js';
import adminRoutes from './routes/admin.js';
import videoRoutes from './routes/video.js';


// Middleware
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimit.js';

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://mediconnect25.vercel.app',
  /https?:\/\/.*\.vercel\.app$/, // Allow any Vercel subdomain
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(ao => (typeof ao === 'string' ? ao === origin : ao.test(origin)))) {
        callback(null, true);
      } else {
        console.log('CORS Blocked Origin:', origin);
        callback(null, true); // Temporarily true for deployment debugging
      }
    },
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Connect to databases
// Connect to databases
console.log('Starting server initialization...');

console.log('Attempting Redis connection...');
try {
  await connectRedis();
  console.log('Redis connection attempt finished.');
} catch (err) {
  console.error('Failed to initialize Redis:', err.message);
}

console.log('Attempting MongoDB connection...');
try {
  await connectDB();
  console.log('MongoDB connection attempt finished.');
} catch (err) {
  console.error('CRITICAL: Failed to connect to MongoDB. Server cannot start properly.', err.message);
  // process.exit(1); // Optional: keep running to show health check error?
}

console.log('Attempting RabbitMQ connection...');
try {
  await connectRabbitMQ();
  console.log('RabbitMQ connection attempt finished.');
  startEmailWorker();
  startNotificationWorker();
} catch (err) {
  console.error('Failed to initialize RabbitMQ/Workers:', err.message);
}

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(ao => (typeof ao === 'string' ? ao === origin : ao.test(origin)))) {
      callback(null, true);
    } else {
      console.log('CORS Blocked Express:', origin);
      callback(null, true); // Temporarily true for deployment debugging
    }
  },
  credentials: true
}));
app.use(rateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug Middleware: Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Attach Redis to request
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'MediConnect API is running', timestamp: new Date() });
});

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/medical-history', medicalHistoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/video', videoRoutes);

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-user', (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on('join-doctor', (doctorId) => {
    socket.join(`doctor:${doctorId}`);
  });

  // WebRTC Signaling for Video Consultations
  socket.on('join-video-room', ({ roomId, userId }) => {
    console.log(`User ${userId} joining video room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('offer', ({ roomId, offer, userId }) => {
    socket.to(roomId).emit('offer', { offer, userId, socketId: socket.id });
  });

  socket.on('answer', ({ roomId, answer, userId }) => {
    socket.to(roomId).emit('answer', { answer, userId, socketId: socket.id });
  });

  socket.on('ice-candidate', ({ roomId, candidate, userId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, userId });
  });

  socket.on('leave-video-room', ({ roomId, userId }) => {
    console.log(`User ${userId} leaving video room ${roomId}`);
    socket.to(roomId).emit('user-left', { userId });
    socket.leave(roomId);
  });

  socket.on('end-video-call', ({ roomId, userId }) => {
    console.log(`User ${userId} ending video call in room ${roomId}`);
    io.to(roomId).emit('call-ended', { userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };