// Shared by Express and Vite: the HTML document must receive the policy too.
export function contentSecurityPolicy({ development = false, scriptHashes = [] } = {}) {
  return {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", ...scriptHashes],
      scriptSrcAttr: ["'none'"],
      // Vite injects CSS during development. Reviews cannot contain styles.
      styleSrc: development ? ["'self'", "'unsafe-inline'"] : ["'self'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", 'http://localhost:4000',
        ...(development ? ['ws://localhost:5175'] : [])],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'self'"]
    }
  };
}
