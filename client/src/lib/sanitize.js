import DOMPurify from 'dompurify'

// Allowlist: only the light formatting reviews need
const CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'a', 'br', 'p', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
}

// Links that open a new tab must not get access to window.opener
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? '', CONFIG)