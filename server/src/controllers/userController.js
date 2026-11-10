import Joi from 'joi';
import { User } from '../models/User.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel']
};

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(60),
  email: Joi.string().email()
});

function publicUser(u) {
  return { id: u._id.toString(), name: u.name, email: u.email, createdAt: u.createdAt };
}

// GET /api/users
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json({ users: users.map(publicUser) });
  } catch (err) { next(err); }
}

// GET /api/users/:id
export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
}

// PATCH /api/users/:id — only the logged-in user can edit their own account
export async function updateUser(req, res, next) {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ message: 'You can only edit your own account' });

    const { value, error } = updateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const sanitizedName = DOMPurify.sanitize(value.name || '', PURIFY_CONFIG);
    const sanitizedEmail = DOMPurify.sanitize(value.email || '', PURIFY_CONFIG);
    const sanaitizedPassword = DOMPurify.sanitize(value.password || '', PURIFY_CONFIG);
    // Replace the raw name with the sanitized version before saving
    const safeData = {
      ...value,
      name: sanitizedName,
      email: sanitizedEmail,
      password: sanaitizedPassword
    };
    
    const doc = await User.findByIdAndUpdate(req.params.id, { $set: safeData }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'User not found' });
    res.json({ user: publicUser(doc) });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email already used' });
    next(err);
  }
}

// DELETE /api/users/:id — only the logged-in user can delete their own account
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ message: 'You can only delete your own account' });

    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
}
