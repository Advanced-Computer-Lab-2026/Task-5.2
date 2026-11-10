import Joi from 'joi';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Review } from '../models/Review.js';

const { window } = new JSDOM('');
const purify = createDOMPurify(window);

const sanitizeReviewBody = (dirty = '') =>
  purify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'strong', 'em', 'i', 'u', 's',
      'br', 'p', 'ul', 'ol', 'li',
      'a', 'blockquote', 'code', 'pre', 'span'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

const reviewSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).default(5),
  body: Joi.string().min(1).required(),
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
    const cleanBody = sanitizeReviewBody(req.body?.body ?? '');

    const { value, error } = reviewSchema.validate({
      ...req.body,
      body: cleanBody
    });

    if (error) return res.status(400).json({ message: error.message });

    const doc = await Review.create({
      ...value,
      body: cleanBody,
      author: req.user.id
    });

    const review = await Review.findById(doc._id).populate('author', 'name').lean();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}