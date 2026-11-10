import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Content-Security-Policy for the page itself (the HTML the browser renders).
// script-src 'self' means only our own bundled script files may run: any
// injected inline handler such as <img onerror="..."> is refused by the browser.
// connect-src lets the page call our API on :4000.
//
// It is applied to `vite preview` (the production build). The dev server is
// left without it on purpose: Vite's hot-reload injects an inline script that
// a strict CSP would block, which would turn the dev page blank.
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
  // Always use a single copy of React (two copies cause "Invalid hook call"
  // and a blank page).
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 5175
  },
  preview: {
    port: 5175,
    headers: { 'Content-Security-Policy': CSP }
  }
})
