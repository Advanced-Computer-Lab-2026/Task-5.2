import DOMPurify from 'dompurify';

// Treat every stored review as untrusted, including reviews posted before the fix.
// Sanitize immediately before the HTML sink; escaping would lose the formatting.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(
  typeof dirty === 'string' ? dirty : '',
  {
    ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'a',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false
  }
);
