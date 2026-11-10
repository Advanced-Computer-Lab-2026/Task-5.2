import helmet from 'helmet';

// Content-Security-Policy: a browser-enforced allow-list of what a page may load
// and execute. Even if malicious markup slips past sanitization, the browser
// refuses to run it because:
//   - script-src 'self'   → only script FILES from our own origin may run;
//                           no 'unsafe-inline', so inline <script> blocks and
//                           inline event handlers (onerror=, onload=) are blocked.
//   - object-src 'none'   → no <object>/<embed> plugins.
//   - base-uri 'self'     → injected <base> cannot redirect relative script URLs.
//   - form-action 'self'  → injected forms cannot post data to other sites.
//   - frame-ancestors 'none' → the app cannot be framed (clickjacking).
//   - connect-src         → fetch/XHR may only reach our own origin and the API,
//                           which blocks exfiltrating a stolen token with fetch().
export const API_ORIGIN = 'http://localhost:4000';

export const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'", API_ORIGIN],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"]
};

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: cspDirectives
  }
});
