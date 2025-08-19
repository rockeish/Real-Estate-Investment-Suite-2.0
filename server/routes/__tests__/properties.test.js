const request = require('supertest');
const app = require('../../index');
const db = require('../../db');

describe('Properties API', () => {
  afterAll(() => {
    db.end();
  });

  describe('GET /api/properties/search', () => {
    it('should return properties matching the search query', async () => {
      const res = await request(app).get('/api/properties/search?q=test');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 400 if search query is missing', async () => {
      const res = await request(app).get('/api/properties/search');
      expect(res.statusCode).toEqual(400);
    });
  });
});
