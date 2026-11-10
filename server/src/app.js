import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

// Security headers. The Content-Security-Policy is enforced by the browser: even if
// some attacker markup slipped past sanitization, the browser refuses to run inline
// scripts / inline event handlers (onerror=, onload=) or scripts from other origins.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],            // no 'unsafe-inline', no 'unsafe-eval'
        scriptSrcAttr: ["'none'"],        // blocks onerror="..." style handlers
        objectSrc: ["'none'"],            // no <object>/<embed> plugins
        baseUri: ["'self'"],              // stop <base href> hijacking relative URLs
        frameAncestors: ["'none'"],       // no clickjacking via iframes
        formAction: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"]            // fetch()/XHR can't exfiltrate to attacker.example
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
