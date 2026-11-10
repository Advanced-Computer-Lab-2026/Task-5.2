import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

// Security headers + a strict Content-Security-Policy (defense-in-depth for XSS).
// Even if malicious markup slipped past client-side sanitization, the browser
// refuses to run inline scripts / event handlers or load scripts from other origins.
export const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],                 // no 'unsafe-inline', no 'unsafe-eval'
  scriptSrcAttr: ["'none'"],             // blocks inline handlers like onerror="..."
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'", 'http://localhost:4000'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"]
};

app.use(
  helmet({
    contentSecurityPolicy: { useDefaults: false, directives: cspDirectives }
  })
);
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5175', credentials: false }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Not found
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;
