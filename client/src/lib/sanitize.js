// Reviews are rendered as HTML so people can use light formatting (bold, links).
// This helper is the single place review HTML passes through before it is handed
// to React's dangerouslySetInnerHTML.
//
// TODO (security): right now this returns the HTML untouched, so whatever a
// reviewer typed — including <script> and onerror handlers — is injected into
// every viewer's page. Make this strip dangerous markup before it is rendered.
import DOMPurify from "dompurify";

const REVIEW_CONFIG = {
  ALLOWED_TAGS: [
    "b",
    "strong",
    "i",
    "em",
    "u",
    "s",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "a",
  ],
  ALLOWED_ATTR: ["href", "title"],
  ALLOW_DATA_ATTR: false,
};

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer nofollow");
  }
});

export const sanitizeHtml = (dirty) =>
  DOMPurify.sanitize(String(dirty ?? ""), REVIEW_CONFIG);
