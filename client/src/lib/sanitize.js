import DOMPurify from 'dompurify';

DOMPurify.setConfig({
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li','a'],
  ALLOWED_ATTR: ['href', 'title']
});

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty);