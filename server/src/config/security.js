import helmet from 'helmet';

// Apply the assignment's custom CSP to Express API responses.
export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'self'"],
        // Local development uses HTTP. Enable upgrading on HTTPS deployments.
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      }
    },
    strictTransportSecurity: process.env.NODE_ENV === 'production'
  });
}
