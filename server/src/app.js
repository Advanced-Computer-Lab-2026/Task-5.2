import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

// Security headers + a strict, custom Content-Security-Policy.
// The CSP is enforced by the browser: even if some injected markup slipped past
// sanitization, inline scripts and event handlers (onerror=...) are refused, and
// scripts may only be loaded from our own origin.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],            // no 'unsafe-inline', no 'unsafe-eval'
        scriptSrcAttr: ["'none'"],        // blocks inline handlers like onerror="..."
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],           // where fetch/XHR may send data (stops exfiltration)
        objectSrc: ["'none'"],            // no <object>/<embed> plugins
        baseUri: ["'self'"],              // stops <base href> hijacking
        formAction: ["'self'"],
        frameAncestors: ["'none'"]        // no clickjacking via iframes
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
