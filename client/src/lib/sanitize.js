import DOMPurify from 'dompurify';

// Keep basic review formatting while removing executable or otherwise unsafe
// markup before it reaches React's dangerouslySetInnerHTML sink.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['a', 'b', 'blockquote', 'br', 'code', 'em', 'i', 'li', 'ol', 'p', 'strong', 'ul'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false
});
