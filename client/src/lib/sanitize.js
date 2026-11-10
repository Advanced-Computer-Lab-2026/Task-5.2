import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Review bodies are HTML written by other users, so they are untrusted.
// Keep only light formatting; DOMPurify removes everything else
// (<script>, onerror/onclick handlers, javascript: links, ...).
const REVIEW_HTML_RULES = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href'],
  // Links may only point to normal web pages or email addresses.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
}

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? '', REVIEW_HTML_RULES)
