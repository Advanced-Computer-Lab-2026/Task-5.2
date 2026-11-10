import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is where untrusted markup is neutralized.
//
// We use an explicit allow-list: only the formatting tags a review legitimately
// needs survive. Everything else — <script>, <img>, <svg>, <iframe>, <style>,
// every on* event handler, style attributes, and javascript:/data: URLs — is
// removed by DOMPurify before the browser ever parses it as live DOM.
const REVIEW_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'a', 'br', 'p', 'ul', 'ol', 'li', 'code', 'blockquote'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOW_DATA_ATTR: false,
  // Only allow http(s) and mailto links (blocks javascript:, data:, vbscript:, ...)
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
}

// Every link that survives sanitization opens in a new tab without giving the
// opened page a handle back to ours (prevents reverse-tabnabbing).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(String(dirty ?? ''), REVIEW_CONFIG)
