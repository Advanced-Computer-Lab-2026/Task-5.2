import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cspHeader } from '../security/csp.mjs'

export default defineConfig(({ command }) => ({
  // React Fast Refresh inserts an inline script. Use ordinary module updates
  // in development so script-src can remain strict without unsafe-inline.
  plugins: command === 'build' ? [react()] : [],
  esbuild: { jsx: 'automatic' },
  server: {
    port: 5175,
    strictPort: true,
    headers: { 'Content-Security-Policy': cspHeader({ development: true }) }
  },
  preview: {
    headers: { 'Content-Security-Policy': cspHeader() }
  }
}))
