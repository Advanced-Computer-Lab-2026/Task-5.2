
import DOMPurify from 'dompurify';

// Reviews are allowed to contain basic formatting,
// but dangerous HTML and JavaScript must be removed.
export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b',
      'strong',
      'i',
      'em',
      'u',
      'p',
      'br',
      'a',
      'ul',
      'ol',
      'li'
    ],

    ALLOWED_ATTR: [
      'href',
      'title'
    ],

    ALLOW_DATA_ATTR: false,

    // Do not allow dangerous elements.
    FORBID_TAGS: [
      'script',
      'style',
      'iframe',
      'object',
      'embed',
      'svg',
      'math'
    ],

    // Never allow JavaScript event handlers.
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover'
    ]
  });
};
