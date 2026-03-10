const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://moto-x-cult.pages.dev',
  'https://main.moto-x-cult.pages.dev',
  'https://be871260.moto-x-cult.pages.dev',
  'https://motoxcult.pages.dev'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Moto-X Cult API is running' });
});

// Global Error Handler to avoid returning HTML
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.http_code || 500).json({ 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
