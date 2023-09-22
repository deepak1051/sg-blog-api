import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import passport from 'passport';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import './services/passport.js';
import { errorHandler } from './middleware/errorMiddleware.js';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('connected to mongodb'))
  .catch((err) => console.log(err.message));

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    // origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieSecret],
  })
);

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authentication('session'));

app.use(authRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
