// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Security: user-submitted markup must NEVER be trusted. DOMPurify parses the
// HTML and strips everything that can execute script (<script>, on* event
// handlers, javascript: URLs, data: URIs with scripts, etc.) while keeping the
// benign formatting tags intact. This is the sanitizer half of the
// defense-in-depth pair; the server's Content-Security-Policy (helmet) is the
// other half and would still block inline script even if a payload slipped
// through here.
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(dirty, {
    FORBID_TAGS: ['style'],
    FORBID_ATTR: ['style'],
  });
