import DOMPurify from 'dompurify'

// Whitelist approach: only light formatting is allowed (bold, italics, lists,
// line breaks, links). Everything else (script, img, svg, iframe, style, ...)
// is removed, along with every event-handler attribute (onerror, onload, ...).
const CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  // Only http(s) and mailto links survive, so javascript: URLs are dropped.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
}

// Force safe link behaviour on every surviving <a href>.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

// The single place review HTML passes through before dangerouslySetInnerHTML.
export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? '', CONFIG)