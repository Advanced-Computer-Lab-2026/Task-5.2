import Joi from 'joi';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Review } from '../models/Review.js';

const DOMPurify = createDOMPurify(new JSDOM('').window);

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
});

// Never trust the client: sanitize before the body is stored.
const sanitizeBody = (html) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
    ALLOW_DATA_ATTR: false,
  });

const reviewSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).default(5),
  // Free-form HTML (bold, links, etc.), sanitized below before saving
  body: Joi.string().min(1).max(2000).required(),
  // the author is always the logged-in user, never taken from the body
  author: Joi.forbidden()
});

// GET /api/reviews?listing=<id>  (public)
export async function getReviewsForListing(req, res, next) {
  try {
    const { listing } = req.query;
    if (!listing) return res.status(400).json({ message: 'listing query param is required' });

    const reviews = await Review.find({ listing })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// POST /api/reviews  (requires auth)
export async function createReview(req, res, next) {
  try {
    const { value, error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const cleanBody = sanitizeBody(value.body);
    if (!cleanBody.trim()) {
      return res.status(400).json({ message: 'Review body is empty after sanitizing' });
    }

    const doc = await Review.create({ ...value, body: cleanBody, author: req.user.id });
    const review = await Review.findById(doc._id).populate('author', 'name').lean();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}