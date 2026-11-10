import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// DOMPurify parses the untrusted markup and returns a cleaned string: it drops
// <script> elements, strips inline event handlers (onerror, onload, onclick, ...),
// and neutralizes dangerous URL schemes such as javascript:, while keeping the
// benign formatting reviewers are allowed to use.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

export const sanitizeHtml = (dirty) => {
  if (dirty == null) return '';
  return DOMPurify.sanitize(String(dirty), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Never allow these, regardless of the allow-lists above.
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  });
};
