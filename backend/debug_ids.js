require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Review = require('./models/Review');
const Product = require('./models/Product');

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        const reviews = await Review.find().lean();
        console.log('REVIEWS:');
        for (const r of reviews) {
            console.log(`ReviewID: ${r._id}, User: ${r.user}, Product: ${r.productId} (${typeof r.productId})`);
        }

        const users = await User.find().lean();
        console.log('\nUSERS:');
        for (const u of users) {
            console.log(`UserID: ${u._id}, Email: ${u.email}, Role: ${u.role}`);
        }

        const products = await Product.find().limit(2).lean();
        console.log('\nSAMPLE PRODUCTS:');
        for (const p of products) {
            console.log(`ProductID: ${p._id}, Name: ${p.name}`);
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugData();
