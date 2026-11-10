import DOMPurify from 'dompurify'

const CONFIG = {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
}

export const sanitizeHtml = (dirty) => {
    if (typeof dirty !== 'string' || !dirty) return ''
    return DOMPurify.sanitize(dirty, CONFIG)
}