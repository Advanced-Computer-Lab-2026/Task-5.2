import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty = '') =>
  DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'strong', 'em', 'i', 'u', 's',
      'br', 'p', 'ul', 'ol', 'li',
      'a', 'blockquote', 'code', 'pre', 'span'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });