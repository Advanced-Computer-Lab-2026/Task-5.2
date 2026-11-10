import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Only an allow-list of formatting tags and attributes survives; everything else
// (<script>, <img>, <svg>, on* event handlers, javascript: URLs, ...) is stripped.
const REVIEW_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false
};

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? '', REVIEW_CONFIG);
