import request from 'supertest';
import app from '../../server.js';
import Doctor from '../../models/Doctor.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

describe('Doctor API', () => {
  let authToken;
  let doctorId;

  beforeAll(async () => {
    // Create a test doctor user
    const doctor = await Doctor.create({
      name: 'Dr. Test User',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Cardiology',
      experience: 10,
      licenseNumber: 'LIC123456',
      consultationFee: 500,
      isVerified: true
    });

    doctorId = doctor._id;

    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'doctor@test.com',
        password: 'password123',
        role: 'doctor'
      });

    authToken = res.body.token;
  });

  afterAll(async () => {
    await Doctor.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/doctors', () => {
    it('should get all doctors', async () => {
      const res = await request(app)
        .get('/api/doctors')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.doctors).toBeInstanceOf(Array);
      expect(res.body.doctors.length).toBeGreaterThan(0);
    });

    it('should filter doctors by specialty', async () => {
      const res = await request(app)
        .get('/api/doctors?specialty=Cardiology')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.doctors.every(d => d.specialization === 'Cardiology')).toBe(true);
    });

    it('should search doctors by name', async () => {
      const res = await request(app)
        .get('/api/doctors?search=Test')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.doctors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/doctors/:id', () => {
    it('should get doctor by ID', async () => {
      const res = await request(app)
        .get(`/api/doctors/${doctorId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.doctor).toHaveProperty('_id', doctorId.toString());
      expect(res.body.doctor).toHaveProperty('name', 'Dr. Test User');
    });

    it('should return 404 for non-existent doctor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/doctors/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/doctors/:id/availability', () => {
    it('should get doctor availability', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/doctors/${doctorId}/availability?date=${dateStr}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.availability).toBeInstanceOf(Array);
    });

    it('should return 400 for missing date parameter', async () => {
      const res = await request(app)
        .get(`/api/doctors/${doctorId}/availability`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/doctors/profile', () => {
    it('should update doctor profile', async () => {
      const res = await request(app)
        .put('/api/doctors/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          experience: 12,
          consultationFee: 600
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.doctor.experience).toBe(12);
      expect(res.body.doctor.consultationFee).toBe(600);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .put('/api/doctors/profile')
        .send({ experience: 12 })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});