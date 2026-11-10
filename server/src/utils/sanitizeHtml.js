import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// DOMPurify needs a DOM; on the server we give it one from jsdom.
const DOMPurify = createDOMPurify(new JSDOM('').window);

// Only the light formatting reviewers legitimately need
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'];
const ALLOWED_ATTR = ['href', 'title'];

export function sanitizeReviewHtml(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i, // blocks javascript: links
  });
}
