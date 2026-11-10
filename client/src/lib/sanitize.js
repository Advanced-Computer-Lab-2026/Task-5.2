import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML, so it must strip anything that can run code.
//
// DOMPurify parses the HTML and keeps only an allow-list of formatting tags and
// attributes. Everything else is dropped: <script>, <iframe>, <svg>, inline event
// handlers (onerror, onload, onclick, ...), style, and javascript:/data: URLs.
const ALLOWED_TAGS = [
  'b', 'strong', 'i', 'em', 'u', 's', 'p', 'br',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'
];
const ALLOWED_ATTR = ['href', 'title'];

// Links in reviews point to other sites: open them safely in a new tab.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
});

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i
  });
