import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Security: review bodies are untrusted user input. We run them through DOMPurify
// with a strict ALLOW-list so only harmless formatting survives. Everything else
// — <script>, <img>/<svg>/<iframe>, inline event handlers (onerror, onload, ...),
// style attributes and javascript:/data: URLs — is removed before it reaches the DOM.
const ALLOWED_TAGS = [
  'b', 'strong', 'i', 'em', 'u', 's', 'p', 'br',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'
]
const ALLOWED_ATTR = ['href', 'title']

const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  // Only http(s) and mailto links; blocks javascript:, data:, vbscript:, etc.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  ALLOW_DATA_ATTR: false
}

// Make every surviving link open safely in a new tab without giving the
// opened page a handle on ours (reverse tabnabbing).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(typeof dirty === 'string' ? dirty : '', SANITIZE_CONFIG)
