import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Review bodies are untrusted, so we sanitize against a strict allowlist: only
// harmless formatting tags survive, the only attribute kept is a link's href, and
// DOMPurify drops <script>, on* event handlers and javascript:/data: URLs.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'a', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code']
const ALLOWED_ATTR = ['href']

// Links in reviews point at other sites: open them in a new tab without giving
// the target page a handle on ours (window.opener) or leaking the referrer.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), { ALLOWED_TAGS, ALLOWED_ATTR })
