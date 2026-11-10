import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CSP for the page itself. The browser enforces the CSP of the *document*, and
// the SPA document is served by Vite (not by the API), so the same policy the
// API sends via helmet is also attached here for the built app.
//
// It is applied to `vite preview` (the production build) only: the dev server
// injects an inline React-refresh preamble that a strict script-src would block.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data:",
  "style-src 'self'",
  "connect-src 'self' http://localhost:4000"
].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
  },
  preview: {
    port: 5175,
    headers: {
      'Content-Security-Policy': CSP
    }
  }
})
