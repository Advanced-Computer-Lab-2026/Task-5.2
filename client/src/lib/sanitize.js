// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// TODO (security): right now this returns the HTML untouched, so whatever a
// reviewer typed — including <script> and onerror handlers — is injected into
// every viewer's page. Make this strip dangerous markup before it is rendered.
export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML; // Converts '<script>' into '&lt;script&gt;'
};

