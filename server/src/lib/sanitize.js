import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Server-side layer of the defence-in-depth for review bodies.
//
// The client already sanitizes at the render sink, but the API is public: anyone
// can POST straight to /api/reviews and any other consumer of GET /api/reviews
// (a mobile app, an admin panel, an email digest...) would otherwise receive the
// raw payload. So we also clean the HTML before it is ever stored.
//
// DOMPurify needs a DOM; on Node we give it a jsdom window. The allowlist mirrors
// client/src/lib/sanitize.js so legitimate formatting is preserved identically.

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'a', 'br', 'p', 'ul', 'ol', 'li', 'blockquote', 'code'];
const ALLOWED_ATTR = ['href'];
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

export function sanitizeReviewHtml(dirty) {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false
  }).trim();
}

// True when the sanitized HTML has no visible text left (e.g. the body was
// nothing but a malicious <img onerror> or <script>).
export function isEffectivelyEmpty(html) {
  const el = window.document.createElement('div');
  el.innerHTML = html;
  return el.textContent.trim() === '';
}
