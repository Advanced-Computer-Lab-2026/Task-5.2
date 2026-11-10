// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is where untrusted markup is neutralized.
//
// We use DOMPurify with a strict ALLOW-LIST: only a handful of harmless formatting
// tags and the attributes a link needs survive. Everything else is removed, including
// <script>, <iframe>, <svg>, <img>, <style>, every on* event-handler attribute
// (onerror, onload, onclick...), and javascript:/data: URLs.
import DOMPurify from 'dompurify'

const REVIEW_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li', 'a', 'blockquote', 'code'],
  ALLOWED_ATTR: ['href', 'title'],
  // Only http(s) and mailto links are allowed. Relative URLs are also allowed.
  // Anything else, e.g. javascript: or data:, gets its href dropped.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  ALLOW_DATA_ATTR: false
}

// Make every surviving link open safely in a new tab (prevents reverse tabnabbing).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(typeof dirty === 'string' ? dirty : '', REVIEW_CONFIG)
