import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The same strict CSP the API sends, applied to the HTML page itself when serving
// the production build (`vite preview`). The built bundle has no inline scripts,
// so script-src 'self' is enough. (The dev server is left without it because
// React Fast Refresh injects an inline preamble script in development.)
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' http://localhost:4000",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
  },
  preview: {
    port: 5175,
    headers: { 'Content-Security-Policy': CSP }
  }
})
