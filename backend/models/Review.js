const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            ref: 'Product',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Enforce one review per user per product
reviewSchema.index({ productId: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
