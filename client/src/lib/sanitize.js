import DOMPurify from 'dompurify'

// Allowlist: only light formatting survives. Everything else is stripped.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a']
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel']

// Force safe behavior on every link that survives sanitizing
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

// The single place review HTML passes through before dangerouslySetInnerHTML.
export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i, // blocks javascript: and data: links
    ALLOW_DATA_ATTR: false,
  })