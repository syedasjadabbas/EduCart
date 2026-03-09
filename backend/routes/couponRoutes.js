const express = require('express');
const router = express.Router();
const {
    getCoupons,
    createCoupon,
    validateCoupon,
    toggleCouponState,
    deleteCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.post('/validate', protect, validateCoupon);

router.route('/:id/toggle')
    .put(protect, admin, toggleCouponState);

router.route('/:id')
    .delete(protect, admin, deleteCoupon);

module.exports = router;
