
import Joi from 'joi';
import { Review } from '../models/Review.js';

const reviewSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).default(5),
  body: Joi.string().min(1).max(2000).required(),
  author: Joi.forbidden()
});

// GET /api/reviews?listing=<id> (public)
export async function getReviewsForListing(req, res, next) {
  try {
    const { listing } = req.query;

    if (!listing) {
      return res.status(400).json({
        message: 'listing query param is required'
      });
    }

    const reviews = await Review.find({ listing })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews (requires authentication)
export async function createReview(req, res, next) {
  try {
    const { value, error } = reviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // The author always comes from the authenticated user.
    // The original HTML is stored and sanitized by the client before rendering.
    const doc = await Review.create({
      ...value,
      author: req.user.id
    });

    const review = await Review.findById(doc._id)
      .populate('author', 'name')
      .lean();

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}
