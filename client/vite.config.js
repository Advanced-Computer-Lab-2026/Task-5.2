import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { randomBytes } from 'node:crypto'
import { securityHeaders } from '../server/src/security.js'

const noncePlaceholder = '__VITE_REQUEST_CSP_NONCE__'

function pageSecurity() {
  return {
    name: 'page-security',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const nonce = randomBytes(24).toString('base64')
        // Vite adds the placeholder to its scripts and style-loader meta tag.
        // Replace it with a fresh nonce for each HTML response.
        const end = res.end
        res.end = function (chunk, ...args) {
          if (chunk && String(res.getHeader('Content-Type')).includes('text/html')) {
            chunk = chunk.toString().replaceAll(noncePlaceholder, nonce)
            res.removeHeader('Content-Length')
          }
          return end.call(this, chunk, ...args)
        }
        securityHeaders({ development: true, nonce })(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(securityHeaders())
    }
  }
}

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), pageSecurity()],
  html: { cspNonce: command === 'serve' && !isPreview ? noncePlaceholder : undefined },
  server: {
    port: 5175,
    strictPort: true
  }
}))
