import request from 'supertest';
import app from '../../server.js';
import Appointment from '../../models/Appointment.js';
import Doctor from '../../models/Doctor.js';
import Patient from '../../models/Patient.js';
import mongoose from 'mongoose';

describe('Appointment API', () => {
  let patientToken;
  let doctorToken;
  let patientId;
  let doctorId;
  let appointmentId;

  beforeAll(async () => {
    // Create test patient
    const patient = await Patient.create({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'patient'
    });
    patientId = patient._id;

    // Create test doctor
    const doctor = await Doctor.create({
      name: 'Dr. Test Doctor',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Cardiology',
      experience: 10,
      licenseNumber: 'LIC123456',
      consultationFee: 500,
      isVerified: true,
      availability: {
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        workingHours: { start: '09:00', end: '17:00' }
      }
    });
    doctorId = doctor._id;

    // Get patient token
    const patientRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'patient@test.com',
        password: 'password123',
        role: 'patient'
      });
    patientToken = patientRes.body.token;

    // Get doctor token
    const doctorRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'doctor@test.com',
        password: 'password123',
        role: 'doctor'
      });
    doctorToken = doctorRes.body.token;
  });

  afterAll(async () => {
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/appointments/book', () => {
    it('should book an appointment', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const res = await request(app)
        .post('/api/appointments/book')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: doctorId.toString(),
          date: tomorrow.toISOString(),
          timeSlot: '10:00',
          patientDetails: {
            patientName: 'Test Patient',
            patientAge: 30,
            patientGender: 'male',
            contactNumber: '1234567890',
            symptoms: 'Fever and cough'
          }
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.appointment).toHaveProperty('_id');
      appointmentId = res.body.appointment._id;
    });

    it('should return 400 for invalid time slot', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const res = await request(app)
        .post('/api/appointments/book')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: doctorId.toString(),
          date: tomorrow.toISOString(),
          timeSlot: '08:00', // Outside working hours
          patientDetails: {
            patientName: 'Test Patient',
            patientAge: 30,
            patientGender: 'male',
            contactNumber: '1234567890'
          }
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/appointments/patient', () => {
    it('should get patient appointments', async () => {
      const res = await request(app)
        .get('/api/appointments/patient')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointments).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/appointments/doctor', () => {
    it('should get doctor appointments', async () => {
      const res = await request(app)
        .get('/api/appointments/doctor')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointments).toBeInstanceOf(Array);
    });
  });

  describe('PUT /api/appointments/:id/status', () => {
    it('should update appointment status', async () => {
      const res = await request(app)
        .put(`/api/appointments/${appointmentId}/status`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          status: 'completed',
          diagnosis: 'Common cold',
          notes: 'Rest and hydration recommended'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointment.status).toBe('completed');
    });
  });

  describe('PUT /api/appointments/:id/cancel', () => {
    it('should cancel appointment', async () => {
      // Create another appointment to cancel
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      
      const appointmentRes = await request(app)
        .post('/api/appointments/book')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: doctorId.toString(),
          date: tomorrow.toISOString(),
          timeSlot: '11:00',
          patientDetails: {
            patientName: 'Test Patient',
            patientAge: 30,
            patientGender: 'male',
            contactNumber: '1234567890'
          }
        });

      const cancelRes = await request(app)
        .put(`/api/appointments/${appointmentRes.body.appointment._id}/cancel`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          reason: 'Unexpected emergency'
        })
        .expect(200);

      expect(cancelRes.body.success).toBe(true);
    });
  });
});