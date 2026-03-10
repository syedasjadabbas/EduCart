const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Simple auth middleware (inline, no separate file needed)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get all reviews globally
// @route   GET /api/reviews
// @access  Public (for Admin dash)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .lean();
            
        // Manual populate to avoid CastError with legacy mock products
        const mongoose = require('mongoose');
        const productIds = reviews.map(r => r.productId).filter(id => id && mongoose.Types.ObjectId.isValid(id.toString()));
        const products = await Product.find({ _id: { $in: productIds } }).select('name image').lean();
        const productMap = products.reduce((acc, p) => {
            acc[p._id.toString()] = p;
            return acc;
        }, {});

        const populatedReviews = reviews.map(r => ({
            ...r,
            productId: productMap[r.productId?.toString()] || { _id: r.productId, name: `Product ID: ${r.productId}` }
        }));

        res.json(populatedReviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user's reviews
// @route   GET /api/reviews/mine
// @access  Private
router.get('/mine', protect, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        
        // Manual populate to avoid CastError with legacy mock products
        const mongoose = require('mongoose');
        const productIds = reviews.map(r => r.productId).filter(id => id && mongoose.Types.ObjectId.isValid(id.toString()));
        const products = await Product.find({ _id: { $in: productIds } }).select('name image').lean();
        const productMap = products.reduce((acc, p) => {
            acc[p._id.toString()] = p;
            return acc;
        }, {});

        const populatedReviews = reviews.map(r => ({
            ...r,
            productId: productMap[r.productId?.toString()] || { _id: r.productId, name: `Product ID: ${r.productId}` }
        }));

        res.json(populatedReviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get reviews for a product (by productId string from mockProducts)
// @route   GET /api/reviews/:productId
// @access  Public
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Submit a review for a product
// @route   POST /api/reviews/:productId
// @access  Private (logged in users only)
router.post('/:productId', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user._id,
            productId: req.params.productId
        });

        if (existingReview) {
            // Update the existing review
            existingReview.rating = Number(rating);
            existingReview.comment = comment;
            await existingReview.save();

            // Update Product stats
            const product = await Product.findById(req.params.productId);
            if (product) {
                const reviews = await Review.find({ productId: req.params.productId });
                product.numReviews = reviews.length;
                product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
                await product.save();
            }

            const populated = await existingReview.populate('user', 'name');
            return res.status(200).json(populated);
        }

        const review = await Review.create({
            user: req.user._id,
            productId: req.params.productId,
            rating: Number(rating),
            comment,
        });

        // Update Product stats
        const product = await Product.findById(req.params.productId);
        if (product) {
            const reviews = await Review.find({ productId: req.params.productId });
            product.numReviews = reviews.length;
            product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            await product.save();
        }

        const populated = await review.populate('user', 'name');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin or Owner)
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership or admin status
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const productId = review.productId;
        await Review.deleteOne({ _id: review._id });

        // Update Product stats only if it's a real MongoDB ObjectId
        const mongoose = require('mongoose');
        if (productId && mongoose.Types.ObjectId.isValid(productId.toString())) {
            const product = await Product.findById(productId);
            if (product) {
                const reviews = await Review.find({ productId });
                product.numReviews = reviews.length;
                product.ratings = reviews.length > 0
                    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
                    : 0;
                await product.save();
            }
        }

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
