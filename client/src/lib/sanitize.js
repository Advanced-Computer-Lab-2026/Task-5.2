import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it must strip anything executable.
//
// Allow-list only the light formatting reviewers legitimately need. Everything
// else — <script>, <img>, <svg>, event handlers like onerror/onload, style,
// and javascript: URLs — is removed.
const CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
}

// Links in reviews open in a new tab without giving the target page access to ours.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(String(dirty ?? ''), CONFIG)
