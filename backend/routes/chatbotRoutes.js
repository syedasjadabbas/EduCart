const express = require('express');
const router = express.Router();
const { handleChat, getAutocomplete, getRecommendations } = require('../controllers/chatbotController');

router.post('/query', handleChat);
router.get('/autocomplete', getAutocomplete);
router.get('/recommendations', getRecommendations);

module.exports = router;
