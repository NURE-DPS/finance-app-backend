import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { walletRoutes } from './modules/wallet/wallet.routes';
import { authRoutes } from './modules/auth/auth.routes';


dotenv.config();


const app = express();
const PORT = Number(process.env.PORT) || 8000;


app.use(express.json());


// Test route
app.get('/', (req, res) => {
  res.send('Hello world!');
});


app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);


app.listen(PORT, () => {
  console.log('started');
});
