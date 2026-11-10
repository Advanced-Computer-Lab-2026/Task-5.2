import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createContentSecurityPolicy } from '../server/src/middleware/contentSecurityPolicy.js'

const localPagePolicy = {
  connectSrc: ["'self'", 'http://localhost:4000'],
  upgradeInsecureRequests: null
}

const pageSecurityPolicy = {
  name: 'page-security-policy',
  configureServer(server) {
    // Permit Vite's generated React Refresh script by its exact content.
    const preamble = react.preambleCode.replace('__BASE__', server.config.base)
    const hash = createHash('sha256').update(preamble).digest('base64')
    server.middlewares.use(createContentSecurityPolicy({
      ...localPagePolicy,
      scriptSrc: ["'self'", `'sha256-${hash}'`]
    }))
  },
  configurePreviewServer(server) {
    server.middlewares.use(createContentSecurityPolicy(localPagePolicy))
  }
}

export default defineConfig({
  plugins: [react(), pageSecurityPolicy],
  server: {
    port: 5175
  },
  preview: {
    port: 5175
  }
})
