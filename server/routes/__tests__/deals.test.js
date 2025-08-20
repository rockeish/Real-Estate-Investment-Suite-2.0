const request = require('supertest');
const app = require('../../index');
const db = require('../../db');

describe('Deals API', () => {
  afterAll(() => {
    db.end();
  });

  it('should get all deals', async () => {
    const res = await request(app).get('/api/deals');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
