import request from 'supertest';
import app from '../../server.js';
import Doctor from '../../models/Doctor.js';
import mongoose from 'mongoose';

describe('Performance and Load Tests', () => {
  beforeAll(async () => {
    // Create multiple doctors for testing
    const doctors = [];
    for (let i = 0; i < 50; i++) {
      doctors.push({
        name: `Dr. Test ${i}`,
        email: `doctor${i}@test.com`,
        password: 'password123',
        role: 'doctor',
        specialization: i % 2 === 0 ? 'Cardiology' : 'Dermatology',
        experience: 5 + (i % 10),
        licenseNumber: `LIC${i.toString().padStart(6, '0')}`,
        consultationFee: 500 + (i * 10),
        isVerified: true,
        isActive: true
      });
    }
    await Doctor.insertMany(doctors);
  });

  afterAll(async () => {
    await Doctor.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Database Query Performance', () => {
    it('should handle large dataset queries efficiently', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .get('/api/doctors?specialty=Cardiology')
        .expect(200);

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(res.body.success).toBe(true);
      expect(res.body.doctors.length).toBeGreaterThan(0);
      
      // Query should complete within 500ms
      expect(queryTime).toBeLessThan(500);
    });

    it('should handle pagination efficiently', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .get('/api/doctors?page=1&limit=10')
        .expect(200);

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(res.body.success).toBe(true);
      expect(res.body.doctors).toHaveLength(10);
      expect(queryTime).toBeLessThan(300);
    });

    it('should handle search queries efficiently', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .get('/api/doctors?search=Test')
        .expect(200);

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(res.body.success).toBe(true);
      expect(queryTime).toBeLessThan(400);
    });
  });

  describe('API Response Performance', () => {
    it('should respond quickly to health check', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/doctors')
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(200);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill().map(() => 
        request(app).get('/api/doctors?specialty=Cardiology')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All requests should succeed
      responses.forEach(res => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      // Concurrent requests should complete reasonably quickly
      expect(totalTime).toBeLessThan(1000);
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not leak memory on repeated requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Make multiple identical requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/doctors?page=1&limit=5')
          .expect(200);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});