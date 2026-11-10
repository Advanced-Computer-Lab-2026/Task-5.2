import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Allow-list only basic formatting; everything else (script, event handlers,
// javascript: URLs, etc.) is stripped by DOMPurify.
const CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false,
};

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(String(dirty ?? ''), CONFIG);
