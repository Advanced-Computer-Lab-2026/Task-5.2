import { randomBytes } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const cspNonce = randomBytes(18).toString('base64')
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  `script-src 'self' 'nonce-${cspNonce}'`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "connect-src 'self' http://localhost:4000 ws://localhost:5175",
].join('; ')

const devCspNoncePlugin = {
  name: 'dev-csp-nonce',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      return html.replace(
        '<script type="module">import { injectIntoGlobalHook',
        `<script type="module" nonce="${cspNonce}">import { injectIntoGlobalHook`,
      )
    },
  },
}

const securityHeaders = { 'Content-Security-Policy': contentSecurityPolicy }

export default defineConfig({
  plugins: [react(), devCspNoncePlugin],
  server: {
    port: 5175,
    headers: securityHeaders,
  },
  preview: {
    headers: securityHeaders,
  },
})
