import DOMPurify from 'dompurify';

// Reviewers may use basic text formatting and safe links, but active content,
// styles, embedded media, and event handlers are never allowed.
const REVIEW_HTML_OPTIONS = {
  ALLOWED_TAGS: ['a', 'b', 'blockquote', 'br', 'code', 'em', 'i', 'li', 'ol', 'p', 'strong', 'u', 'ul'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false,
};

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(typeof dirty === 'string' ? dirty : '', REVIEW_HTML_OPTIONS);
