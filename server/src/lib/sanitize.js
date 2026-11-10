import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Server-side copy of the client's review sanitizer. The client sanitizes at
// render time; this sanitizes at write time so malicious markup never even
// reaches the database (an attacker can skip our UI and POST directly).
// Keep this allow-list in sync with client/src/lib/sanitize.js.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'a'];
const ALLOWED_ATTR = ['href', 'title'];
const SAFE_URL = /^(?:https?:|mailto:)/i;

const { window } = new JSDOM('');
const purifier = createDOMPurify(window);

purifier.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';
    if (!SAFE_URL.test(href)) node.removeAttribute('href');
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
});

export function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string') return '';
  return purifier.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR, ALLOW_DATA_ATTR: false }).trim();
}
