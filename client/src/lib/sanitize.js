import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// We run the reviewer's HTML through DOMPurify, which parses it and removes
// anything that can execute script: <script> elements, inline event-handler
// attributes (onerror, onload, onclick, ...), and dangerous URL schemes such as
// javascript:. Benign formatting (bold, links, etc.) is preserved, so the review
// still reads the way the author intended — it just can no longer run code in a
// viewer's session.
export const sanitizeHtml = (dirty) => {
  if (dirty == null) return '';
  return DOMPurify.sanitize(String(dirty), {
    // Drop javascript:/data: style URLs on href/src instead of keeping them.
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Belt-and-suspenders: forbid the <script> tag and any on* handler outright.
    FORBID_TAGS: ['script'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  });
};
