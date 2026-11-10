import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
  },
  // The API's CSP only covers responses from :4000. The page that actually
  // renders reviews comes from here, so the built app (`vite build` +
  // `vite preview`) gets its own strict policy too. It is not applied to
  // `vite dev`, because the dev server's React Fast Refresh injects an inline
  // script that a policy without 'unsafe-inline' would block.
  preview: {
    port: 5175,
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "script-src-attr 'none'",
        "style-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self' http://localhost:4000",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ].join('; ')
    }
  }
})
