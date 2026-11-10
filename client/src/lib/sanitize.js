import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it must turn untrusted markup into
// markup that cannot run script.
//
// Strategy: an explicit ALLOWLIST. Anything not listed below is removed, which
// covers <script>, <iframe>, <svg>, <style>, every on* event handler,
// style attributes, and so on.
const ALLOWED_TAGS = [
  'b', 'strong', 'i', 'em', 'u', 's', 'br', 'p',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'
];
const ALLOWED_ATTR = ['href', 'title'];

// Links may only use these protocols. This blocks javascript:, data:, vbscript:.
const SAFE_URL = /^(?:https?:|mailto:)/i;

const purifier = DOMPurify();

// Runs on every element after DOMPurify has filtered attributes.
purifier.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';
    if (!SAFE_URL.test(href.trim())) {
      node.removeAttribute('href');
    } else {
      // Open external links safely: no reverse-tabnabbing, no referrer leak.
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  }
});

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string' || dirty === '') return '';
  return purifier.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Some tags (script, style) also have their text content dropped.
    FORBID_CONTENTS: ['script', 'style', 'template', 'noscript']
  });
};
