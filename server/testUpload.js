require('dotenv').config();
const express = require('express');
const upload = require('./middleware/uploadMiddleware');

const app = express();

app.post('/test', upload.single('image'), (req, res) => {
  res.json({ message: 'Success', file: req.file });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: err.message, stack: err.stack });
});

app.listen(5002, () => console.log('Test server running on 5002'));
