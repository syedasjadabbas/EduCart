const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Please provide a coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discount: {
            type: Number,
            required: [true, 'Please provide a discount amount (percentage)'],
            min: 1,
            max: 100,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
