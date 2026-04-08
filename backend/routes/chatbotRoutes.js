const express = require('express');
const router = express.Router();
const { handleChat, getAutocomplete, getRecommendations } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const userOnly = (req, res, next) => {
	if (!req.user) return res.status(401).json({ message: 'Not authorized' });
	if (req.user.role === 'admin') {
		return res.status(403).json({ message: 'Chatbot is only available for logged-in users.' });
	}
	next();
};

router.post('/query', protect, userOnly, handleChat);
router.get('/autocomplete', protect, userOnly, getAutocomplete);
router.get('/recommendations', getRecommendations);

module.exports = router;
