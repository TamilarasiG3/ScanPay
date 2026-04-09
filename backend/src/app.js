import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

export default app;
