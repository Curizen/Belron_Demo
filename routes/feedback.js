const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/send-rating', feedbackController.submitRating);

module.exports = router;
