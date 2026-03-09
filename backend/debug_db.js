require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Review = require('./models/Review');
const Product = require('./models/Product');

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        console.log('--- USERS ---');
        const users = await User.find({}, 'name email role');
        console.log(users);

        console.log('\n--- REVIEWS ---');
        const reviews = await Review.find().populate('user', 'name').populate('productId', 'name');
        console.log(JSON.stringify(reviews, null, 2));

        console.log('\n--- PRODUCT COUNT ---');
        const pCount = await Product.countDocuments();
        console.log('Total Products:', pCount);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugData();
