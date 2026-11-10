import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.

// Only the formatting the reviews feature needs. Everything else is removed.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a'];
const ALLOWED_ATTR = ['href'];

// Links open in a new tab and cannot reach back into the page that opened them.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), { ALLOWED_TAGS, ALLOWED_ATTR });