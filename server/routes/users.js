const express = require('express');
const router = express.Router();

// User profile and management routes will go here
router.get('/', (req, res) => {
  res.json({ message: 'User routes' });
});

module.exports = router;
