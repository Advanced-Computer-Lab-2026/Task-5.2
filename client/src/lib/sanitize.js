import DOMPurify from 'dompurify'

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML. Only a small allowlist of formatting tags is
// kept; scripts, event handlers and all other attributes are stripped.
export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(dirty ?? '', {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a'],
    ALLOWED_ATTR: ['href'],
  })
