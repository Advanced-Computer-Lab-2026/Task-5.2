import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CSP for the page that actually renders reviews. Scripts may only come from our
// own origin, inline handlers (onerror=...) are blocked, and the page may only
// talk to itself and the API.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' http://localhost:4000",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'"
].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
    // No CSP in dev: Vite's React fast-refresh injects an inline script that a
    // strict script-src would block. Use `npm run build && npm run preview` to
    // test with the policy enforced.
  },
  preview: {
    port: 5175,
    headers: { 'Content-Security-Policy': CSP }
  }
})
