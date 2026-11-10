import DOMPurify from 'dompurify'

// Only light formatting is allowed in a review body. Anything not listed here
// (script, img, svg, iframe, style, event-handler attributes, ...) is removed.
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  // Links may only point to http(s) or mailto, never javascript: or data:
  ALLOWED_URI_REGEXP: /^(?:https?|mailto):/i,
  ALLOW_DATA_ATTR: false,
}

// Force safe link behaviour on every <a> that survives sanitizing.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(String(dirty ?? ''), SANITIZE_CONFIG)
