// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// TODO (security): right now this returns the HTML untouched, so whatever a
// reviewer typed — including <script> and onerror handlers — is injected into
// every viewer's page. Make this strip dangerous markup before it is rendered.
import sanitizeHtml from 'sanitize-html'
export const sanitizeHtml = (dirty) => dirty;
