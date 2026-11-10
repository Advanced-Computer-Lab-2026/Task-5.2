import Joi from 'joi';
import { Review } from '../models/Review.js';
import { sanitizeReviewHtml, isEffectivelyEmpty } from '../lib/sanitize.js';

const reviewSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).default(5),
  // The body is free-form HTML (the reviewer can add bold text, links, etc.).
  body: Joi.string().min(1).required(),
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

    // Never store user-supplied markup as-is: strip anything executable and keep
    // only the allowlisted formatting. If nothing readable is left, the review
    // was pure markup/script, so reject it instead of saving an empty body.
    const body = sanitizeReviewHtml(value.body);
    if (isEffectivelyEmpty(body)) {
      return res.status(400).json({ message: 'Review body must contain some text' });
    }

    const doc = await Review.create({ ...value, body, author: req.user.id });
    const review = await Review.findById(doc._id).populate('author', 'name').lean();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}
