import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

app.use(morgan('dev'));

// Security headers, including a strict Content-Security-Policy.
// Defense-in-depth: DOMPurify cleans the markup, and this policy tells the
// browser to refuse inline/injected script even if something slips through.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"], // blocks inline handlers such as onerror= / onclick=
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
      },
    },
    // The client (:5175) calls this API cross-origin, so allow it to read responses.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

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