import DOMPurify from 'dompurify';

const allowedTags = [
  'a', 'b', 'blockquote', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'hr', 'i', 'li', 'ol', 'p', 'pre', 's', 'span', 'strong',
  'u', 'ul'
];

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ['href', 'title']
  });
};
