import createDOMPurify from 'dompurify';

const purify = createDOMPurify(window);

export const sanitizeHtml = (dirty = '') => {
  if (typeof dirty !== 'string') return '';

  return purify.sanitize(dirty, {
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
};
