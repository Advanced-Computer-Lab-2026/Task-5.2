import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is the one seam that must neutralize
// untrusted markup.
//
// We SANITIZE (not escape) because we want to keep legitimate formatting. The
// config is an explicit ALLOWLIST: anything not listed — <script>, <iframe>,
// <svg>, <img>, <style>, every on* event handler, style attributes — is dropped.
// DOMPurify also strips dangerous URL schemes such as javascript: from href.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'a'];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

// Links that open in a new tab must not get a handle on our window
// (reverse tabnabbing), so force rel="noopener noreferrer" on them.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(typeof dirty === 'string' ? dirty : '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
