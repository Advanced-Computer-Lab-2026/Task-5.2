
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty) => {
  return DOMPurify.sanitize(dirty);
};
