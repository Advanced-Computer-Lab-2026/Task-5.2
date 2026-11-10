import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Same policy the API sends via helmet (server/src/app.js). It is applied to the
// built app served by `vite preview`, because that HTML page is the document the
// browser enforces it on. It is NOT applied to `vite dev`: React Fast Refresh
// injects an inline <script> in dev mode, which a strict CSP would (correctly) block.
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
  "font-src 'self'",
  "connect-src 'self' http://localhost:4000"
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
