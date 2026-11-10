import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CSP for the client page itself (the API's CSP header only covers API responses).
// Applied to `vite preview` (the production build). It is not applied to the dev
// server, because Vite's dev mode injects an inline React-refresh script that a
// strict policy would block.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "connect-src 'self' http://localhost:4000",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'"
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
