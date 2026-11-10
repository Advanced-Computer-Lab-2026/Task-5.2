import DOMPurify from 'dompurify';

// Keep only the HTML needed for review formatting. Sanitize immediately before
// rendering, including reviews that were already stored in the database.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
});
