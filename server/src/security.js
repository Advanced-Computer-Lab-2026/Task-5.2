import helmet from 'helmet';

// The frontend also uses this policy: CSP on JSON alone cannot protect a page.
export function securityHeaders({ development = false, nonce } = {}) {
  const scripts = ["'self'"];
  if (nonce) scripts.push(`'nonce-${nonce}'`);

  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: scripts,
        scriptSrcAttr: ["'none'"],
        styleSrc: nonce ? ["'self'", `'nonce-${nonce}'`] : ["'self'"],
        imgSrc: ["'self'", 'https:', 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", 'http://localhost:4000', ...(development ? ['ws://localhost:5175'] : [])],
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"]
      }
    },
    // Local development uses HTTP. Enable HSTS at the HTTPS deployment boundary.
    strictTransportSecurity: false
  });
}
