import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is where untrusted markup is neutralized.
//
// We use an allow-list: only harmless formatting tags and attributes survive.
// Everything else (<script>, <img>, <svg>, <iframe>, on* event handlers, style,
// javascript:/data: URLs, ...) is stripped by DOMPurify.
const ALLOWED_TAGS = [
  'b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li',
  'blockquote', 'code', 'pre', 'a'
]
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel']

// Only allow http(s) and mailto links (blocks javascript:, data:, vbscript:, ...).
const SAFE_URL = /^(?:https?:|mailto:)/i

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href')
    if (href && !SAFE_URL.test(href.trim())) node.removeAttribute('href')
    // Links opening a new tab must not get a handle on window.opener.
    if (node.getAttribute('target')) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer nofollow')
    }
  }
})

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(typeof dirty === 'string' ? dirty : '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false
  })
