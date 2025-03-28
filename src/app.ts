import "reflect-metadata";
import express from 'express';
import authRoutes from './modules/auth/auth.controller'
import dotenv from 'dotenv'


dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello world!');
});




app.listen(PORT, () => {
  console.log("started");
});
