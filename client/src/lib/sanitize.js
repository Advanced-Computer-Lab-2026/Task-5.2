import DOMPurify from 'dompurify';

// Treat stored reviews as untrusted, including reviews created before this fix.
// Keep light formatting, but exclude scripts, images, SVG, forms, and CSS.
// DOMPurify also removes event handlers and unsafe URL protocols.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(
  typeof dirty === 'string' ? dirty : '',
  {
    ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false
  }
);
