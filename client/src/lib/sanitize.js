import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is the one seam that must make
// untrusted, user-supplied markup safe.
//
// We use an explicit ALLOWLIST rather than trying to block "bad" things: anything
// not listed here (<script>, <img>, <svg>, <iframe>, <style>, <form>, on* event
// handlers, style attributes, ...) is removed. DOMPurify also drops dangerous URL
// schemes such as javascript: and data: from href.
const REVIEW_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li', 'a', 'blockquote', 'code'],
  ALLOWED_ATTR: ['href', 'title'],
  // Only plain web / mail links survive; everything else (javascript:, data:,
  // vbscript:, ...) is stripped from href.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  ALLOW_DATA_ATTR: false,
  // Remove disallowed elements together with their contents (e.g. script bodies),
  // but keep the text of harmless unknown wrappers.
  FORBID_TAGS: ['style', 'script', 'template', 'noscript'],
  KEEP_CONTENT: true
}

let hooked = false
function addLinkHook() {
  if (hooked) return
  hooked = true
  // Every surviving link opens in a new tab without giving the target page a
  // handle to ours (reverse-tabnabbing protection) and without passing referrer.
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer nofollow')
    }
  })
}

export const sanitizeHtml = dirty => {
  if (typeof dirty !== 'string' || dirty === '') return ''
  addLinkHook()
  return DOMPurify.sanitize(dirty, REVIEW_CONFIG)
}
