import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self' http://localhost:4000",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export default defineConfig({
  plugins: [react()],
  server: { port: 5175 },
  preview: { port: 5175, headers: { "Content-Security-Policy": CSP } },
});
