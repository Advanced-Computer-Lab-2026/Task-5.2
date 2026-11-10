import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

// Security headers, including a strict Content-Security-Policy (CSP).
// The CSP tells the browser what it is allowed to load and run. The key rule is
// script-src 'self': only script FILES from our own origin may run. Inline
// script (<script>...</script>, onerror="...", javascript: URLs) is refused,
// and injected XSS needs exactly that, so even if malicious HTML ever reached
// the page, the browser would not execute it. We never add 'unsafe-inline'.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],            // fallback for anything not listed below
        scriptSrc: ["'self'"],             // no inline / injected / third-party scripts
        scriptSrcAttr: ["'none'"],         // explicitly block onerror=, onclick=, ...
        objectSrc: ["'none'"],             // no <object>/<embed> plugins
        baseUri: ["'self'"],               // stop <base href> hijacking relative URLs
        formAction: ["'self'"],            // forms can only submit to us
        frameAncestors: ["'none'"],        // nobody may frame us (clickjacking)
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'"],
        connectSrc: ["'self'"]
      }
    }
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