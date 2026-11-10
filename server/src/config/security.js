import helmet from 'helmet';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5175';

// Content-Security-Policy: a browser-enforced allowlist of what a page may load
// and execute. Even if some markup slips past sanitization, the browser refuses
// to run script that is not explicitly allowed here.
//
//  - script-src 'self'        -> only script files served from our own origin.
//                                No 'unsafe-inline' / 'unsafe-eval', so inline
//                                <script> blocks, eval() and injected code do not run.
//  - script-src-attr 'none'   -> inline event handlers (onerror=, onload=, onclick=)
//                                are blocked; this is the exact vector used in Flow.md.
//  - object-src 'none'        -> no <object>/<embed> plugins.
//  - base-uri 'self'          -> an injected <base> cannot re-point relative URLs.
//  - form-action 'self'       -> injected forms cannot post to an attacker.
//  - frame-ancestors 'none'   -> the app cannot be framed (clickjacking).
//  - connect-src              -> fetch/XHR only to ourselves and the known client,
//                                which limits where a script could exfiltrate data.
export const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'", 'data:'],
  fontSrc: ["'self'"],
  connectSrc: ["'self'", CLIENT_ORIGIN],
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