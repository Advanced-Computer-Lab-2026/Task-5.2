import DOMPurify from 'dompurify'

// Reviews support basic formatting and links. Keep the allowlist small so
// submitted HTML cannot introduce executable or otherwise active content.
export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') return ''

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'i', 'li', 'ol', 'p', 'strong', 'u', 'ul'],
    ALLOWED_ATTR: ['href', 'title'],
  })
}
