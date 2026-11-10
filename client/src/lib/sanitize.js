import DOMPurify from "dompurify";

// Allow-list: only these tags and attributes survive. Everything else is removed.
const CONFIG = {
  ALLOWED_TAGS: [
    "b",
    "strong",
    "i",
    "em",
    "u",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "a",
  ],
  ALLOWED_ATTR: ["href", "title"],
  // Links may only be http, https or mailto, so no javascript: links
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
};

export const sanitizeHtml = (dirty) => DOMPurify.sanitize(dirty ?? "", CONFIG);
