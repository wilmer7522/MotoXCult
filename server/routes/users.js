const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const photoController = require('../controllers/photoController');

// User profile and management routes
router.get('/me', auth, userController.getProfile);
router.post('/bikes', auth, userController.addBike);
router.delete('/bikes/:id', auth, userController.deleteBike);
router.post('/photos', auth, upload.single('image'), photoController.uploadPhoto);

router.get('/', (req, res) => {
  res.json({ message: 'User routes' });
});

module.exports = router;
