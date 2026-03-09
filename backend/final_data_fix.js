require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function finalDataFix() {
    try {
        await mongoose.connect(MONGO_URI);
        const usersCol = mongoose.connection.db.collection('users');
        const productsCol = mongoose.connection.db.collection('products');
        const reviewsCol = mongoose.connection.db.collection('reviews');

        const reviews = await reviewsCol.find({}).toArray();
        const users = await usersCol.find({}).toArray();
        const products = await productsCol.find({}).toArray();

        // Create mappings
        const userMap = {};
        users.forEach(u => {
            const sid = String(u._id);
            userMap[sid] = u._id;
        });

        const prodMap = {};
        products.forEach(p => {
            const sid = String(p._id);
            prodMap[sid] = p._id;
        });

        console.log(`Analyzing ${reviews.length} reviews...`);

        for (const review of reviews) {
            const updates = {};

            // Fix User ID
            const ruser = String(review.user);
            if (userMap[ruser]) {
                // If it's a match, use the REAL ID object/type from users col
                if (String(review.user) !== String(userMap[ruser]) || typeof review.user !== typeof userMap[ruser]) {
                    updates.user = userMap[ruser];
                }
            }

            // Fix Product ID
            const rprod = String(review.productId);
            if (prodMap[rprod]) {
                if (String(review.productId) !== String(prodMap[rprod]) || typeof review.productId !== typeof prodMap[rprod]) {
                    updates.productId = prodMap[rprod];
                }
            }

            if (Object.keys(updates).length > 0) {
                console.log(`Updating review ${review._id} with consistent IDs.`);
                await reviewsCol.updateOne({ _id: review._id }, { $set: updates });
            }
        }

        console.log('Final data fix complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
finalDataFix();
