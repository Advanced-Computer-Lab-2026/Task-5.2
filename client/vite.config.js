import { randomBytes } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The API (Express + helmet) sends its own CSP, but the HTML page users actually
// open is served by Vite, so the page needs a policy too — otherwise the browser
// would still run injected inline script on the reviews page.
//
// In dev, Vite / React Fast Refresh inject a few inline <script>/<style> tags.
// Instead of weakening the policy with 'unsafe-inline', we give Vite a nonce
// (html.cspNonce) which it stamps on the tags it injects itself. Injected
// review markup never carries the nonce, so it stays blocked.
// NOTE: this nonce is per dev-server start; a production server must generate a
// fresh nonce per response.
const nonce = randomBytes(16).toString('base64')

const API_ORIGIN = 'http://localhost:4000'
const PORT = 5175

const csp = [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}'`,
  "script-src-attr 'none'",
  `style-src 'self' 'nonce-${nonce}'`,
  "img-src 'self' data:",
  `connect-src 'self' ${API_ORIGIN} ws://localhost:${PORT}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ')

export default defineConfig({
  plugins: [react()],
  html: { cspNonce: nonce },
  server: {
    port: PORT,
    strictPort: true,
    headers: { 'Content-Security-Policy': csp }
  }
})
