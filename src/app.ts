import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { walletRoutes } from './modules/wallet/wallet.routes';
import { authRoutes } from './modules/auth/auth.routes';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { transactionRoutes } from './modules/transaction/transaction.routes';
import { categoriesRoutes } from './modules/category/category.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Test route
app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoriesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('started');
});
