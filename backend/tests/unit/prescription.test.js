import request from 'supertest';
import app from '../../server.js';
import Prescription from '../../models/Prescription.js';
import Doctor from '../../models/Doctor.js';
import Patient from '../../models/Patient.js';
import Appointment from '../../models/Appointment.js';
import mongoose from 'mongoose';

describe('Prescription API', () => {
  let patientToken;
  let doctorToken;
  let pharmacistToken;
  let patientId;
  let doctorId;
  let appointmentId;
  let prescriptionId;

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
      isVerified: true
    });
    doctorId = doctor._id;

    // Create test pharmacist
    const pharmacist = await Patient.create({
      name: 'Test Pharmacist',
      email: 'pharmacist@test.com',
      password: 'password123',
      role: 'pharmacist'
    });

    // Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: new Date(),
      timeSlot: '10:00',
      consultationFee: 500,
      status: 'completed'
    });
    appointmentId = appointment._id;

    // Get tokens
    const patientRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'patient@test.com',
        password: 'password123',
        role: 'patient'
      });
    patientToken = patientRes.body.token;

    const doctorRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'doctor@test.com',
        password: 'password123',
        role: 'doctor'
      });
    doctorToken = doctorRes.body.token;

    const pharmacistRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'pharmacist@test.com',
        password: 'password123',
        role: 'pharmacist'
      });
    pharmacistToken = pharmacistRes.body.token;
  });

  afterAll(async () => {
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/prescriptions', () => {
    it('should create a prescription', async () => {
      const res = await request(app)
        .post('/api/prescriptions')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          appointmentId: appointmentId.toString(),
          diagnosis: 'Hypertension',
          medicines: [
            {
              name: 'Losartan',
              dosage: '50mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take with food'
            }
          ],
          notes: 'Monitor blood pressure regularly'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.prescription).toHaveProperty('_id');
      prescriptionId = res.body.prescription._id;
    });
  });

  describe('GET /api/prescriptions', () => {
    it('should get patient prescriptions', async () => {
      const res = await request(app)
        .get('/api/prescriptions')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.prescriptions).toBeInstanceOf(Array);
    });
  });

  describe('PUT /api/prescriptions/:id/validate', () => {
    it('should validate prescription as pharmacist', async () => {
      const res = await request(app)
        .put(`/api/prescriptions/${prescriptionId}/validate`)
        .set('Authorization', `Bearer ${pharmacistToken}`)
        .send({
          status: 'approved',
          validationNotes: 'Prescription validated successfully'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.prescription.status).toBe('approved');
    });
  });

  describe('DELETE /api/prescriptions/:id', () => {
    it('should delete prescription', async () => {
      // Create another prescription to delete
      const prescription = await Prescription.create({
        patient: patientId,
        fileName: 'test.pdf',
        fileUrl: 'https://example.com/test.pdf',
        fileSize: 1024,
        status: 'pending'
      });

      const res = await request(app)
        .delete(`/api/prescriptions/${prescription._id}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });
});