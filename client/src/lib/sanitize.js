import DOMPurify from 'dompurify'

const REVIEW_HTML_POLICY = {
  ALLOWED_TAGS: [
    'a', 'b', 'blockquote', 'br', 'code', 'em', 'i', 'li', 'ol', 'p',
    'pre', 'strong', 'u', 'ul'
  ],
  ALLOWED_ATTR: ['href', 'title']
}

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), REVIEW_HTML_POLICY)
