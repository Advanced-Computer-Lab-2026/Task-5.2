import request from 'supertest';
import app from '../../server/src/app.js';

describe('Content-Security-Policy header', () => {
  test('responses send a CSP header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  test('the CSP restricts scripts to the same origin and blocks inline script', async () => {
    const res = await request(app).get('/api/health');
    const csp = res.headers['content-security-policy'] || '';

    expect(csp).toMatch(/script-src[^;]*'self'/);
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });
});