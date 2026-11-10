import helmet from 'helmet';

export function createContentSecurityPolicy(overrides = {}) {
  return helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      ...overrides
    }
  });
}
