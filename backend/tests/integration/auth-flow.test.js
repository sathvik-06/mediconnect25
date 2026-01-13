import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import Doctor from '../../models/Doctor.js';
import Appointment from '../../models/Appointment.js';
import Prescription from '../../models/Prescription.js';
import mongoose from 'mongoose';

describe('Complete Authentication Flow', () => {
  let patientToken;
  let doctorToken;
  let patientId;
  let doctorId;

  beforeAll(async () => {
    // Clean up any existing test data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Registration and Login', () => {
    it('should register a new patient', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Test Patient',
          email: 'integration.patient@test.com',
          password: 'password123',
          role: 'patient',
          phone: '1234567890',
          dateOfBirth: '1990-01-01',
          gender: 'male'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id');
      patientId = res.body.user.id;
    });

    it('should register a new doctor', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Dr. Integration Test',
          email: 'integration.doctor@test.com',
          password: 'password123',
          role: 'doctor',
          specialization: 'Cardiology',
          experience: 8,
          licenseNumber: 'LIC789012',
          consultationFee: 600
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      doctorId = res.body.user.id;
    });

    it('should login patient', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration.patient@test.com',
          password: 'password123',
          role: 'patient'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      patientToken = res.body.token;
    });

    it('should login doctor', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration.doctor@test.com',
          password: 'password123',
          role: 'doctor'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      doctorToken = res.body.token;
    });
  });

  describe('Complete Appointment Flow', () => {
    let appointmentId;

    it('should book an appointment', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await request(app)
        .post('/api/appointments/book')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: doctorId,
          date: tomorrow.toISOString(),
          timeSlot: '14:00',
          patientDetails: {
            patientName: 'Integration Test Patient',
            patientAge: 33,
            patientGender: 'male',
            contactNumber: '1234567890',
            symptoms: 'Chest pain and shortness of breath'
          },
          notes: 'Follow-up consultation'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.appointment).toHaveProperty('_id');
      appointmentId = res.body.appointment._id;
    });

    it('should update appointment status', async () => {
      const res = await request(app)
        .put(`/api/appointments/${appointmentId}/status`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          status: 'completed',
          diagnosis: 'Hypertension stage 1',
          notes: 'Prescribe medication and lifestyle changes'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointment.status).toBe('completed');
    });

    it('should create prescription for appointment', async () => {
      const res = await request(app)
        .post('/api/prescriptions')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          appointmentId: appointmentId,
          diagnosis: 'Hypertension stage 1',
          medicines: [
            {
              name: 'Losartan',
              dosage: '50mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take in the morning'
            },
            {
              name: 'Hydrochlorothiazide',
              dosage: '12.5mg',
              frequency: 'Once daily',
              duration: '30 days'
            }
          ],
          notes: 'Monitor blood pressure weekly'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.prescription.medicines).toHaveLength(2);
    });
  });

  describe('Profile Management', () => {
    it('should update patient profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          phone: '9876543210',
          address: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345'
          }
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.user.phone).toBe('9876543210');
    });

    it('should update doctor profile', async () => {
      const res = await request(app)
        .put('/api/doctors/profile')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          experience: 9,
          consultationFee: 650,
          hospital: {
            name: 'Integration Test Hospital',
            address: {
              street: '456 Doctor Lane',
              city: 'Medical City',
              state: 'Health State'
            }
          }
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.doctor.experience).toBe(9);
    });
  });

  describe('Data Retrieval', () => {
    it('should get patient appointments', async () => {
      const res = await request(app)
        .get('/api/appointments/patient')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointments.length).toBeGreaterThan(0);
    });

    it('should get doctor appointments', async () => {
      const res = await request(app)
        .get('/api/appointments/doctor')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointments.length).toBeGreaterThan(0);
    });

    it('should get patient prescriptions', async () => {
      const res = await request(app)
        .get('/api/prescriptions')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.prescriptions.length).toBeGreaterThan(0);
    });
  });
});