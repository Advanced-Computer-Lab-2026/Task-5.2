import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Same strict policy the API sends via helmet, applied to the page itself.
// Only on `vite preview` (the built app): the dev server injects an inline
// React-refresh script that a strict script-src would block.
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
  },
  preview: {
    port: 5175,
    headers: { 'Content-Security-Policy': CSP }
  }
})
