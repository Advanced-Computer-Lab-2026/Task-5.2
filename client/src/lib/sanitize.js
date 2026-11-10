// Reviews are rendered as HTML so people can use light formatting
// (bold, italic, links, lists, line breaks). This helper is the single
// place review HTML passes through before it is handed to React's
// dangerouslySetInnerHTML sink.
//
// Anything the reviewer typed that is not in the allow-list below is
// stripped — including <script>, <img onerror>, <svg onload>, style="",
// and javascript: URLs. Rendering untrusted markup is only safe when the
// markup is first neutralised like this.
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'b', 'strong', 'i', 'em', 'u', 's', 'code', 'pre',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'blockquote',
  'a'
];

const ALLOWED_ATTR = ['href', 'title', 'rel', 'target'];

// DOMPurify drops javascript:/data: URIs on href by default, but pinning
// the URI policy keeps the intent explicit and future-proof.
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

export function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string' || dirty.length === 0) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    // Strip <script>…</script> and <style>…</style> bodies entirely
    // rather than leaving their text content behind.
    FORBID_CONTENTS: ['script', 'style', 'iframe', 'object', 'embed'],
    // Never allow SVG/MathML (they carry their own event-handler surface).
    USE_PROFILES: { html: true }
  });
}