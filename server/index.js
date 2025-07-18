import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import router from './routes/index.js';
import cookiesParser from 'cookie-parser';
import { server } from './socket/index.js'
import path from 'path';

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
const __dirname = path.resolve();

app.get('/', (request, response) => {
  response.json('hello');
  response.json({
    message: 'Server running at ' + PORT,
  });
});

app.use('/api', router);


app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});


connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });
