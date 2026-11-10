import DOMPurify from 'dompurify'

const REVIEW_HTML_CONFIG = {
  ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'i', 'li', 'ol', 'p', 'strong', 'u', 'ul'],
  ALLOWED_ATTR: ['href', 'rel', 'title'],
  ALLOW_DATA_ATTR: false,
}

// Keep review formatting intentionally small so untrusted markup cannot become
// an executable DOM node before it reaches dangerouslySetInnerHTML.
export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(dirty, REVIEW_HTML_CONFIG)
