
import DOMPurify from 'dompurify';

// Only allow the HTML needed for basic review formatting.
const sanitizeConfig = {
  ALLOWED_TAGS: [
    'b',
    'strong',
    'i',
    'em',
    'u',
    'p',
    'br',
    'a'
  ],
  ALLOWED_ATTR: [
    'href',
    'title'
  ],
  ALLOW_DATA_ATTR: false
};

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, sanitizeConfig);
};
