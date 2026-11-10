import DOMPurify from 'dompurify'

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['a', 'b', 'br', 'blockquote', 'code', 'del', 'em', 'i', 'li', 'ol', 'p', 'pre', 's', 'strong', 'u', 'ul'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_ARIA_ATTR: false,
  ALLOW_DATA_ATTR: false
})
