import helmet from 'helmet';

// The frontend development server supplies a nonce for its generated scripts.
export function securityHeaders({ development = false, nonce } = {}) {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", ...(nonce ? [nonce] : [])],
        scriptSrcAttr: ["'none'"],
        styleSrc: development ? ["'self'", "'unsafe-inline'"] : ["'self'"],
        connectSrc: development
          ? ["'self'", 'http://localhost:4000', 'ws://localhost:5175']
          : ["'self'"],
        imgSrc: ["'self'", 'https:', 'data:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: development ? null : [],
      },
    },
    strictTransportSecurity: development ? false : undefined,
  });
}
