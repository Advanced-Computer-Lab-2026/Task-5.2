import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import helmet from 'helmet'
import { createHash } from 'node:crypto'
import { contentSecurityPolicy } from '../server/src/security.js'

function securityHeaders() {
  let base
  return {
    name: 'security-headers',
    configResolved(config) { base = config.base },
    configureServer(server) {
      // Permit only React's exact development bootstrap, not arbitrary inline JS.
      const hash = createHash('sha256')
        .update(react.preambleCode.replace('__BASE__', base))
        .digest('base64')
      server.middlewares.use(helmet({
        contentSecurityPolicy: contentSecurityPolicy({
          development: true,
          scriptHashes: [`'sha256-${hash}'`]
        }),
        strictTransportSecurity: false
      }))
    },
    configurePreviewServer(server) {
      server.middlewares.use(helmet({
        contentSecurityPolicy: contentSecurityPolicy(),
        strictTransportSecurity: false
      }))
    }
  }
}

export default defineConfig({
  plugins: [react(), securityHeaders()],
  server: {
    port: 5175,
    strictPort: true
  },
  preview: {
    port: 5175,
    strictPort: true
  }
})
