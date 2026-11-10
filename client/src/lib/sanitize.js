// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so every review body MUST go through it.
//
// We use DOMPurify with a strict allow-list: only harmless formatting tags and a
// couple of attributes survive. Everything else (<script>, <img>, <svg>, <iframe>,
// on* event handlers, style attributes, javascript:/data: URLs, ...) is removed.
import DOMPurify from 'dompurify'

const SANITIZE_CONFIG = {
  // Formatting a reviewer legitimately needs — nothing that can load or run code.
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  // Links may only point to http(s) or mailto — blocks javascript:, data:, vbscript:, etc.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  ALLOW_DATA_ATTR: false
}

// Links in user content open safely and don't pass on SEO credit.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG)
}
