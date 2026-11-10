// // Reviews are rendered as HTML so people can use light formatting (bold, links).
// // This helper is the single place review HTML passes through before it is handed
// // to React's dangerouslySetInnerHTML.
// //
// // TODO (security): right now this returns the HTML untouched, so whatever a
// // reviewer typed — including <script> and onerror handlers — is injected into
// // every viewer's page. Make this strip dangerous markup before it is rendered.
// export const sanitizeHtml = (dirty) => dirty;


import DOMPurify from 'dompurify';

// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// Security fix: DOMPurify strips dangerous markup (like <script> or onerror handlers) 
// before it is rendered, preventing Stored XSS attacks.
export const sanitizeHtml = (dirty) => {
  return DOMPurify.sanitize(dirty);
};