import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet'; // 1. Import helmet
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5175', credentials: false }));

// 2. Configure Helmet with a custom Content-Security-Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow standard inline styling if needed for formatting
      imgSrc: ["'self'", "data:", "blob:"],
    },
  })
);

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