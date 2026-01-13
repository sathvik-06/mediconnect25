import request from 'supertest';
import app from '../../server.js';
import Notification from '../../models/Notification.js';
import Patient from '../../models/Patient.js';
import mongoose from 'mongoose';

describe('Notification API', () => {
  let patientToken;
  let patientId;

  beforeAll(async () => {
    // Create test patient
    const patient = await Patient.create({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'patient'
    });
    patientId = patient._id;

    // Create test notifications
    await Notification.create([
      {
        user: patientId,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: 'Your appointment is tomorrow',
        read: false
      },
      {
        user: patientId,
        type: 'prescription_created',
        title: 'New Prescription',
        message: 'Your prescription is ready',
        read: true
      }
    ]);

    // Get patient token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'patient@test.com',
        password: 'password123',
        role: 'patient'
      });
    patientToken = res.body.token;
  });

  afterAll(async () => {
    await Patient.deleteMany({});
    await Notification.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/notifications', () => {
    it('should get user notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.notifications).toBeInstanceOf(Array);
      expect(res.body.notifications.length).toBe(2);
    });

    it('should return unread count', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.unreadCount).toBe(1);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const notification = await Notification.findOne({ user: patientId, read: false });
      
      const res = await request(app)
        .put(`/api/notifications/${notification._id}/read`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.notification.read).toBe(true);
    });
  });

  describe('PUT /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify all notifications are read
      const unreadCount = await Notification.countDocuments({ 
        user: patientId, 
        read: false 
      });
      expect(unreadCount).toBe(0);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete notification', async () => {
      const notification = await Notification.findOne({ user: patientId });
      
      const res = await request(app)
        .delete(`/api/notifications/${notification._id}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });
});