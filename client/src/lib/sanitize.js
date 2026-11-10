import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is the one seam that must neutralise
// attacker-controlled markup.
//
// Strategy: SANITIZE with an explicit allowlist (not escape), so legitimate
// formatting survives while anything that can execute script is removed.
//   - Only a handful of formatting tags are kept; <script>, <img>, <svg>,
//     <iframe>, <style>, <form>, ... are all dropped.
//   - Only the `href` attribute is kept, so every on* event handler
//     (onerror, onload, onclick, ...) and `style` are stripped.
//   - Links may only use http(s) or mailto URLs (or relative ones), so
//     `javascript:` / `data:` URLs are removed from href.

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'a', 'br', 'p', 'ul', 'ol', 'li', 'blockquote', 'code']
const ALLOWED_ATTR = ['href']
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i

// Make every surviving link open safely in a new tab without giving the target
// page a handle on window.opener (reverse tabnabbing). The hook runs after
// DOMPurify has filtered attributes, so these two are added on top of the allowlist.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string' || dirty === '') return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false
  })
}
