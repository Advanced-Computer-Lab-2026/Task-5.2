// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
    // Allowlist: only light formatting. Everything else (script, img, svg, iframe,
    // style, event-handler attributes, ...) is stripped.
    ALLOWED_TAGS: ['strong', 'b', 'em', 'i', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
};

export const sanitizeHtml = (dirty) => {
    if (typeof dirty !== 'string') return '';
    return DOMPurify.sanitize(dirty, SANITIZE_CONFIG);
};