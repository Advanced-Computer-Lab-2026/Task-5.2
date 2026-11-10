import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import { Review } from '../models/Review.js';

// Light formatting only. Anything outside this allowlist (scripts, <img>, event
// handlers, style, javascript: URLs) is removed before the review is stored.
const REVIEW_HTML_OPTIONS = {
  allowedTags: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  allowedAttributes: { a: ['href'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  disallowedTagsMode: 'discard'
};

const reviewSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).default(5),
  // The body may contain light HTML formatting; it is sanitized before saving.
  body: Joi.string().trim().min(1).max(5000).required(),
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

    const body = sanitizeHtml(value.body, REVIEW_HTML_OPTIONS).trim();
    if (!body) return res.status(400).json({ message: 'Review body is empty after removing disallowed HTML' });

    const doc = await Review.create({ ...value, body, author: req.user.id });
    const review = await Review.findById(doc._id).populate('author', 'name').lean();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}
