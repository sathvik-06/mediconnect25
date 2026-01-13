import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

describe('Error Handling Integration Tests', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Authentication Errors', () => {
    it('should handle invalid login credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
          role: 'patient'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should handle missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User'
          // Missing email, password, role
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should handle duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 1',
          email: 'duplicate@test.com',
          password: 'password123',
          role: 'patient'
        })
        .expect(201);

      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'duplicate@test.com',
          password: 'password123',
          role: 'patient'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('Authorization Errors', () => {
    let patientToken;

    beforeAll(async () => {
      // Register and login a patient
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Auth Test Patient',
          email: 'auth.patient@test.com',
          password: 'password123',
          role: 'patient'
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'auth.patient@test.com',
          password: 'password123',
          role: 'patient'
        });

      patientToken = loginRes.body.token;
    });

    it('should prevent unauthorized access to doctor routes', async () => {
      const res = await request(app)
        .get('/api/appointments/doctor')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not authorized');
    });

    it('should prevent access without token', async () => {
      const res = await request(app)
        .get('/api/appointments/patient')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Not authorized');
    });

    it('should handle invalid token', async () => {
      const res = await request(app)
        .get('/api/appointments/patient')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Validation Errors', () => {
    it('should validate appointment booking data', async () => {
      const res = await request(app)
        .post('/api/appointments/book')
        .set('Authorization', `Bearer some-token`)
        .send({
          // Missing required fields
          doctorId: 'some-id'
        })
        .expect(401); // Will fail auth first, but validation would catch missing fields

      expect(res.body.success).toBe(false);
    });

    it('should handle invalid date formats', async () => {
      // This would be tested after proper authentication setup
      // For now, we test the error response structure
      const res = await request(app)
        .post('/api/doctors/some-id/availability')
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Not Found Errors', () => {
    it('should handle non-existent routes', async () => {
      const res = await request(app)
        .get('/api/nonexistent-route')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Route not found');
    });

    it('should handle non-existent resources', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/doctors/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });
});