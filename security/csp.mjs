// Shared by the API and the frontend document servers.
export function cspDirectives({ development = false } = {}) {
  return {
    'default-src': ["'self'"],
    'base-uri': ["'none'"],
    'object-src': ["'none'"],
    'frame-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'script-src': ["'self'"],
    'script-src-attr': ["'none'"],
    // Vite injects CSS through style elements during development.
    'style-src': development ? ["'self'", "'unsafe-inline'"] : ["'self'"],
    'img-src': ["'self'", 'https:', 'data:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", 'http://localhost:4000',
      ...(development ? ['ws://localhost:5175'] : [])],
  };
}

export function cspHeader(options) {
  return Object.entries(cspDirectives(options))
    .map(([name, values]) => `${name} ${values.join(' ')}`).join('; ');
}
