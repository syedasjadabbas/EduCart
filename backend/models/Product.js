const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        oldPrice: {
            type: Number,
        },
        discount: {
            type: Number,
        },
        stock: {
            type: Number,
            required: true,
        },
        ratings: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        seoTitle: {
            type: String,
        },
        seoDescription: {
            type: String,
        },
        seoKeywords: {
            type: [String],
        },
        slug: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
