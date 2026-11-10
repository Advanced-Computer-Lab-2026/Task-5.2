import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it must turn untrusted markup into safe
// markup. We use an ALLOWLIST: only the formatting tags/attributes below survive;
// everything else (<script>, <img>, <iframe>, on* handlers, style, ...) is removed.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'p', 'br', 'ul', 'ol', 'li', 'a', 'blockquote', 'code'];
const ALLOWED_ATTR = ['href', 'title'];

// Only plain web/mail links are allowed in href (no javascript:, data:, vbscript:, ...).
const SAFE_URL = /^(?:https?:|mailto:)/i;

// Links in reviews open in a new tab without giving the target page access to ours.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
});

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SAFE_URL,
    ADD_ATTR: ['target'], // the hook above adds target; keep it
  });
