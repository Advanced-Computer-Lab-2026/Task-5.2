import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Content-Security-Policy for the page that actually renders reviews.
// - script-src-attr 'none' blocks inline event handlers (onerror=, onload=, ...),
//   the vector a stored-XSS review body uses.
// - The production build has no inline scripts, so it also forbids inline <script>.
// - The dev server needs 'unsafe-inline' for <script> elements only, because
//   @vitejs/plugin-react injects an inline React Refresh preamble.
const baseDirectives = [
  "script-src-attr 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'"
]
const devCsp = ["script-src 'self' 'unsafe-inline'", ...baseDirectives].join('; ')
const prodCsp = ["script-src 'self'", ...baseDirectives].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    headers: { 'Content-Security-Policy': devCsp }
  },
  preview: {
    port: 5175,
    headers: { 'Content-Security-Policy': prodCsp }
  }
})
