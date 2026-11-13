import DOMPurify from 'dompurify';

// Only allow light formatting: bold, italic, paragraphs, lists, links.
const CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false,
};

// The single place all review HTML passes through before rendering.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? '', CONFIG);