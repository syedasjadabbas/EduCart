const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
const createCoupon = async (req, res) => {
    try {
        const { code, discount } = req.body;

        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discount,
            isActive: true
        });

        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Validate/Apply a coupon code
// @route   POST /api/coupons/validate
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (coupon) {
            res.json({
                code: coupon.code,
                discount: coupon.discount,
                message: 'Coupon applied successfully'
            });
        } else {
            res.status(404).json({ message: 'Invalid or expired coupon code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Toggle coupon active status
// @route   PUT /api/coupons/:id/toggle
const toggleCouponState = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            coupon.isActive = !coupon.isActive;
            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Delete coupon
// @route DELETE /api/coupons/:id
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await Coupon.deleteOne({ _id: coupon._id });
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


module.exports = {
    getCoupons,
    createCoupon,
    validateCoupon,
    toggleCouponState,
    deleteCoupon
};
