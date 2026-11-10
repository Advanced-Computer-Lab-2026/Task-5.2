import DOMPurify from 'dompurify'

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