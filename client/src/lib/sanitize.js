import DOMPurify from 'dompurify';

// Reviews support light formatting (bold, links, line breaks). This helper is the
// single place review HTML passes through before it is handed to React's
// dangerouslySetInnerHTML. Anything outside the allowlist is removed: <script>,
// <img>/<svg> event handlers (onerror, onload, ...), javascript: URLs, iframes, forms.
const CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a', 'code', 'blockquote'],
  ALLOWED_ATTR: ['href', 'title'],
};

// Stop a clicked link from reaching back into the page through window.opener.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') node.setAttribute('rel', 'noopener noreferrer');
});

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(String(dirty ?? ''), CONFIG);
