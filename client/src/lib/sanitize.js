import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it is where untrusted markup is neutralized.
//
// DOMPurify parses the string into a DOM tree and rebuilds it keeping ONLY what is
// on an allow-list. Anything else — <script>, <iframe>, <img onerror=...>,
// <svg onload=...>, style attributes, javascript: URLs — is dropped.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'a'];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

// Any link that opens a new tab gets rel="noopener noreferrer" so the opened page
// can't get a handle on our window (reverse tabnabbing).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // only http(s) / mailto links; blocks javascript:, data:, vbscript:, ...
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
  });
