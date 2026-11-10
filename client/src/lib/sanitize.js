import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML — so it is the one seam responsible for
// neutralizing anything dangerous a reviewer might submit.
//
// We use DOMPurify to strip everything except a small allow-list of harmless
// formatting tags/attributes. That removes <script>, inline event handlers
// (onerror/onload/onclick/...), and javascript: URLs, while keeping legitimate
// bold text and links intact. This is layer 1 of our defense-in-depth; the
// server's Content-Security-Policy header is layer 2.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'span'];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Reject javascript:, data:, etc. — only allow safe link protocols.
    ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):/i,
  });
};
