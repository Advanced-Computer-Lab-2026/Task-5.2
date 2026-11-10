import DOMPurify from 'dompurify'

// Reviews may use light formatting. This is the only place that HTML is
// cleaned before ReviewList hands it to dangerouslySetInnerHTML.
// Tags and attributes outside these lists are removed, including <script>,
// inline handlers such as onerror, and javascript: URLs.
const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'i', 'p', 'strong'],
  ALLOWED_ATTR: ['href', 'rel', 'target'],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/|#|\?)/i
}

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(typeof dirty === 'string' ? dirty : '', SANITIZE_OPTIONS)
