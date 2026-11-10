import DOMPurify from "dompurify";

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so this is where we make it safe.
//
// DOMPurify parses the HTML and rebuilds it keeping ONLY what we allow below.
// Everything else is removed: <script>, <iframe>, <svg>, <img>, every on*= event
// handler (onerror, onload, onclick...), style attributes, and dangerous URLs
// such as href="javascript:...".
//
// We use an allow-list (say what IS allowed) rather than a block-list (say what
// is NOT allowed), because attackers keep inventing new tricks a block-list
// would miss.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a']
const ALLOWED_ATTR = ['href']

// Make every surviving link open safely in a new tab.
// rel="noopener noreferrer" stops the opened page from controlling ours
// via window.opener.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function sanitizeHtml(dirty) {
  return DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Only http(s) and mailto links survive; javascript:, data:, vbscript: are dropped.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
  })
}