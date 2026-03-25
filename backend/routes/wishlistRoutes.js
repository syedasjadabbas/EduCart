const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlistItem } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getWishlist)
    .post(protect, toggleWishlistItem);

module.exports = router;
