import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import router from './routes/index.js';
import cookiesParser from 'cookie-parser';
import { server } from './socket/index.js'

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8086;

app.get('/', (request, response) => {
  response.json('hello');
  response.json({
    message: 'Server running at ' + PORT,
  });
});

app.use('/api', router);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });
