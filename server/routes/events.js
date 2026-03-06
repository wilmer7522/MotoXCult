const express = require('express');
const router = express.Router();

// Ride and event routes will go here
router.get('/', (req, res) => {
  res.json({ message: 'Event routes' });
});

module.exports = router;
