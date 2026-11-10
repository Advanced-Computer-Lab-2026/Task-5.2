// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it must strip anything that can run code.
import DOMPurify from 'dompurify'

// Allow-list: only light formatting survives; scripts, <img>/<svg>, on* handlers
// and javascript: URLs are removed.
const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href'],
}

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? '', PURIFY_CONFIG)
