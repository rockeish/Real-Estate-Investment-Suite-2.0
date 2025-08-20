const request = require('supertest');
const app = require('../../index');
const db = require('../../db');

describe('Reports API', () => {
  afterAll(() => {
    db.end();
  });

  describe('GET /api/reports/summary', () => {
    it('should return a summary report', async () => {
      const res = await request(app).get('/api/reports/summary');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('total_properties');
      expect(res.body).toHaveProperty('total_tenants');
      expect(res.body).toHaveProperty('active_leases');
      expect(res.body).toHaveProperty('total_rent_collected');
    });
  });
});
