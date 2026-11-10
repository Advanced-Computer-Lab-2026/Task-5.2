import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { contentSecurityPolicy } from '../server/src/middleware/contentSecurityPolicy.js'

const browserContentSecurityPolicy = {
  name: 'browser-content-security-policy',
  configureServer(server) {
    // Authorize only the exact inline script used by React Fast Refresh.
    const preamble = react.preambleCode.replace('__BASE__', server.config.base)
    const hash = createHash('sha256').update(preamble).digest('base64')
    server.middlewares.use(contentSecurityPolicy({ refreshScriptHash: `'sha256-${hash}'` }))
  },
  configurePreviewServer(server) {
    server.middlewares.use(contentSecurityPolicy())
  },
}

export default defineConfig({
  plugins: [react(), browserContentSecurityPolicy],
  server: {
    port: 5175
  }
})
