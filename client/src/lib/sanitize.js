// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// TODO (security): right now this returns the HTML untouched, so whatever a
// reviewer typed — including <script> and onerror handlers — is injected into
// every viewer's page. Make this strip dangerous markup before it is rendered.
//export const sanitizeHtml = (dirty) => dirty;


import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'strong', 'i', 'em', 'u',
      'p', 'br', 'a', 'ul', 'ol', 'li'
    ],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false
  });
};

