import DOMPurify from 'dompurify';

const reviewHtmlOptions = {
  ALLOWED_TAGS: ['a', 'b', 'blockquote', 'br', 'em', 'i', 'li', 'ol', 'p', 'strong', 'u', 'ul'],
  ALLOWED_ATTR: ['href', 'title']
};

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty, reviewHtmlOptions);
