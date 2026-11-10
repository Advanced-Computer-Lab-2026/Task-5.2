import DOMPurify from 'dompurify';

// Sanitize at display time so existing stored reviews receive the same protection.
// Keep this as the only boundary before review HTML reaches dangerouslySetInnerHTML.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
  // Allow HTTP(S) and relative links; exclude executable and other URL schemes.
  ALLOWED_URI_REGEXP: /^(?:https?:\/\/|[^a-zA-Z]|[a-zA-Z+.-]+(?:[^a-zA-Z+.:\-]|$))/i,
});
