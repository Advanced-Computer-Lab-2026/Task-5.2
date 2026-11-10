import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it must strip anything dangerous.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'];
const ALLOWED_ATTR = ['href', 'title'];

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false
  });