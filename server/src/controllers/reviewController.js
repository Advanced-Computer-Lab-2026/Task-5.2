import Joi from 'joi';
import { Review } from '../models/Review.js';


const reviewSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).default(5),

  // The body is free-form HTML (the reviewer can add bold text, links, etc.).
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

    const doc = await Review.create({ ...value, author: req.user.id });
    const review = await Review.findById(doc._id).populate('author', 'name').lean();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}
