import DOMPurify from 'dompurify'

export const sanitizeHtml = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'strong', 'i', 'em', 'u',
      'p', 'br', 'ul', 'ol', 'li',
      'a', 'blockquote'
    ],
    ALLOWED_ATTR: ['href', 'title']
  })
}