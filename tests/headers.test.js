import request from 'supertest';
import app from '../server/src/app.js';
import { cspHeader } from '../security/csp.mjs';

test.each(['/api/health', '/missing', '/api/reviews'])('API sends enforced CSP on %s', async path => {
  const response = await request(app).get(path);
  const normalize = policy => policy.split(';').map(part => part.trim()).sort();
  expect(normalize(response.headers['content-security-policy'])).toEqual(normalize(cspHeader()));
  expect(response.headers['content-security-policy']).toContain("script-src 'self'");
  expect(response.headers['content-security-policy']).toContain("script-src-attr 'none'");
  expect(response.headers['content-security-policy']).toContain("object-src 'none'");
  expect(response.headers['content-security-policy']).not.toMatch(/unsafe-inline|unsafe-eval/);
});

test('development permits API and HMR connections without inline scripts', () => {
  const policy = cspHeader({ development: true });
  expect(policy).toContain('http://localhost:4000');
  expect(policy).toContain('ws://localhost:5175');
  expect(policy).toContain("script-src 'self';");
  expect(policy).toContain("script-src-attr 'none'");
  expect(cspHeader()).not.toContain('ws://');
});
