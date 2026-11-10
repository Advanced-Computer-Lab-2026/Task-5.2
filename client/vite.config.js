import { randomBytes } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_ORIGIN = 'http://localhost:4000'

// The page itself is served by Vite (not by the Express API), so the browser only
// enforces a Content-Security-Policy if *this* server sends one. It mirrors the
// API's policy (server/src/config/security.js).
//
// Vite's dev server needs a couple of inline <script>/<style> tags (React Fast
// Refresh preamble, injected CSS). Rather than allowing 'unsafe-inline', Vite tags
// each of its own elements with a nonce (html.cspNonce) and the policy only trusts
// that nonce. Injected attacker markup cannot know the nonce, and inline event
// handlers (onerror=...) are blocked outright by script-src-attr 'none'.
const nonce = randomBytes(16).toString('base64')

const csp = [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}'`,
  "script-src-attr 'none'",
  `style-src 'self' 'nonce-${nonce}'`,
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${API_ORIGIN} ws://localhost:5175`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ')

const securityHeaders = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
}

export default defineConfig({
  plugins: [react()],
  html: { cspNonce: nonce },
  server: {
    port: 5175,
    headers: securityHeaders
  },
  preview: {
    port: 5175,
    headers: securityHeaders
  }
})
