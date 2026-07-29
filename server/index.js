const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Moto-X Cult API is running on Cloudflare Workers' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.http_code || 500).json({ 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const handler = serverless(app);

module.exports = {
  default: {
    fetch: (request, env, ctx) => {
      return handler(request, env, ctx);
    }
  }
};

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}
