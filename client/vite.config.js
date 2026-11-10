import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { randomBytes } from 'node:crypto'
import { securityHeaders } from '../server/src/config/security.js'

const noncePlaceholder = '__MARKETPLACE_CSP_NONCE__'

function frontendSecurity() {
  return {
    name: 'frontend-security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const nonce = randomBytes(32).toString('base64')
        // Vite marks its generated script/style tags with the placeholder.
        // Replace it only in the final HTML response, with a fresh nonce.
        const originalEnd = res.end
        res.end = function (chunk, ...args) {
          if (String(res.getHeader('Content-Type')).includes('text/html') && chunk) {
            chunk = chunk.toString().replaceAll(noncePlaceholder, nonce)
          }
          return originalEnd.call(this, chunk, ...args)
        }
        securityHeaders({
          development: true,
          nonce: () => `'nonce-${nonce}'`,
        })(req, res, next)
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), frontendSecurity()],
  html: command === 'serve' ? { cspNonce: noncePlaceholder } : {},
  server: {
    port: 5175,
    strictPort: true,
  }
}))
