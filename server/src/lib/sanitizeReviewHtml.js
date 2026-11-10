import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// The default DOMPurify export needs a global window. On Node there is none, and
// sanitize() would silently return its input unchanged, so bind it to a jsdom window.
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

// Same allowlist as client/src/lib/sanitize.js. Keep the two in step.
const CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a', 'code', 'blockquote'],
  ALLOWED_ATTR: ['href', 'title'],
};

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') node.setAttribute('rel', 'noopener noreferrer');
});

// Applied when a review is stored, so unsafe markup never reaches the database.
export function sanitizeReviewHtml(dirty) {
  return DOMPurify.sanitize(String(dirty ?? ''), CONFIG).trim();
}
