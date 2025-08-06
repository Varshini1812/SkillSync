import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN || '*' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Example Route
app.get('/', (_req, res) => {
  res.send('SkillSync Backend is running ✅');
});

// Mongo Connection
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection failed:', err));
