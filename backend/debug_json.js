require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Review = require('./models/Review');
const Product = require('./models/Product');
const fs = require('fs');

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        const reviews = await Review.find().lean();
        const users = await User.find().lean();
        const products = await Product.find().limit(5).lean();

        const data = {
            reviews,
            users: users.map(u => ({ _id: u._id, email: u.email, role: u.role })),
            products: products.map(p => ({ _id: p._id, name: p.name }))
        };

        fs.writeFileSync('debug_results.json', JSON.stringify(data, null, 2));
        console.log('Results written to debug_results.json');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugData();
