import DOMPurify from 'dompurify';

// Strips dangerous markup (scripts, event handlers, javascript: URLs) while
// keeping safe formatting tags like <b>, <i>, <a href>, etc.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href'],
  ALLOW_DATA_ATTR: false,
});
