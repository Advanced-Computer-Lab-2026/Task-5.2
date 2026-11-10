import helmet from 'helmet';

export function contentSecurityPolicy({ refreshScriptHash } = {}) {
  const scriptSrc = ["'self'"];
  const styleSrc = ["'self'"];
  const connectSrc = ["'self'", 'http://localhost:4000'];

  if (refreshScriptHash) {
    scriptSrc.push(refreshScriptHash);
    styleSrc.push("'unsafe-inline'"); // Vite injects styles during development.
    connectSrc.push('ws://localhost:*'); // Vite hot updates use a local WebSocket.
  }

  return helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc,
      scriptSrcAttr: ["'none'"],
      styleSrc,
      connectSrc,
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
    },
  });
}
