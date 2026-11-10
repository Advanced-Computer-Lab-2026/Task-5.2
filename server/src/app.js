import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

// Security headers. The Content-Security-Policy is the second layer of XSS
// defence: even if malicious markup slipped past sanitization, the browser
// refuses to run inline/injected script because only same-origin script files
// are allowed and inline event handlers (onerror=, onload=, ...) are blocked.
export const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],            // no 'unsafe-inline', no 'unsafe-eval'
  scriptSrcAttr: ["'none'"],        // blocks onerror="..." style handlers
  objectSrc: ["'none'"],            // no <object>/<embed> plugins
  baseUri: ["'self'"],              // stops <base href> hijacking of relative URLs
  formAction: ["'self'"],
  frameAncestors: ["'none'"],       // clickjacking protection
  imgSrc: ["'self'", 'data:'],
  styleSrc: ["'self'"],
  fontSrc: ["'self'"],
  connectSrc: ["'self'", 'http://localhost:4000'],
  upgradeInsecureRequests: null     // local dev runs over plain http
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
