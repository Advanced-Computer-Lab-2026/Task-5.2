import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is the one seam that must keep it safe.
//
// We never trust user-supplied markup: DOMPurify parses it and keeps ONLY the
// allow-listed formatting tags/attributes below. Everything else — <script>,
// <iframe>, <svg>, inline event handlers (onerror, onload, ...), style attributes,
// and dangerous URL schemes such as javascript: — is removed.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li', 'a', 'blockquote', 'code']
const ALLOWED_ATTR = ['href', 'title']

// Links must open safely: force target/rel so a linked page cannot reach back
// into ours through window.opener (reverse tabnabbing).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Only http(s) and mailto links survive; javascript:, data:, vbscript: ... are dropped.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
  })
