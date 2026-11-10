import DOMPurify from 'dompurify';


export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty);








DOMPurify.setConfig({
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li','a'],
  ALLOWED_ATTR: ['href', 'title']
});