import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseCsp = [
  "default-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self' http://localhost:4000 ws://localhost:5175",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'"
]

const csp = (scriptSrc) => [
  ...baseCsp.slice(0, 1),
  `script-src ${scriptSrc}`,
  ...baseCsp.slice(1)
].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    headers: {
      'Content-Security-Policy': csp("'self' 'unsafe-inline'")
    }
  },
  preview: {
    port: 5175,
    headers: {
      'Content-Security-Policy': csp("'self'")
    }
  }
})
