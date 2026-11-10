import Joi from 'joi';
import { Listing } from '../models/Listing.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const listingSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('textbooks', 'electronics', 'furniture', 'clothing', 'other').default('other'),
  condition: Joi.string().valid('new', 'like-new', 'used', 'worn').default('used'),
  status: Joi.string().valid('active', 'sold', 'removed'),
  // the seller is always the logged-in user, never taken from the body
  seller: Joi.forbidden()
});

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'], // Allow basic formatting
  ALLOWED_ATTR: ['href', 'target', 'rel'], // Only allow safe attributes for links
};

export async function getAllListings(req, res, next) {
  try {
    const filter = {};
    if (req.query.includeRemoved !== 'true') filter.status = { $ne: 'removed' };

    const listings = await Listing.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ listings });
  } catch (err) { next(err); }
}

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ listing });
  } catch (err) { next(err); }
}

export async function createListing(req, res, next) {
  try {
    const { value, error } = listingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

     const sanitizedDescription = DOMPurify.sanitize(value.description || '', PURIFY_CONFIG);
    const sanitizedTitle = DOMPurify.sanitize(value.title || '', PURIFY_CONFIG);
    // Replace the raw description with the sanitized version before saving
    const safeData = {
      ...value,
      description: sanitizedDescription,
      title: sanitizedTitle
    };

    const doc = await Listing.create({ ...safeData, seller: req.user.id });
    res.status(201).json({ listing: doc });
  } catch (err) { next(err); }
}

export async function updateListing(req, res, next) {
  try {
    const existing = await Listing.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Listing not found' });
    if (existing.seller?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }

    // drop seller from the merge so the owner can't be reassigned
    const { seller, ...current } = existing.toObject();
    const merged = { ...current, ...req.body };
    const { value, error } = listingSchema.validate(merged, { abortEarly: false, stripUnknown: true, convert: true });
    if (error) return res.status(400).json({ message: error.message });

    const sanitizedDescription = DOMPurify.sanitize(value.description || '', PURIFY_CONFIG);
    const sanitizedTitle = DOMPurify.sanitize(value.title || '', PURIFY_CONFIG);
    // Replace the raw description with the sanitized version before saving
    const safeData = {
      ...value,
      description: sanitizedDescription,
      title: sanitizedTitle
    };

    
    const doc = await Listing.findByIdAndUpdate(req.params.id, { $set: safeData }, { new: true, runValidators: true });
    res.json({ listing: doc });
  } catch (err) { next(err); }
}

// Soft delete: never remove the document, just flip its status.
export async function deleteListing(req, res, next) {
  try {
    const existing = await Listing.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Listing not found' });
    if (existing.seller?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only remove your own listings' });
    }

    existing.status = 'removed';
    await existing.save();
    res.json({ listing: existing });
  } catch (err) { next(err); }
}
