import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CSP for the built app (vite build + vite preview). Not applied to the dev
// server, whose React hot-reload injects an inline script this policy blocks.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "connect-src 'self' http://localhost:4000",
  "img-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
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
