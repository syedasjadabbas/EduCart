require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function checkReviewTypes() {
    try {
        await mongoose.connect(MONGO_URI);
        const reviewsCollection = mongoose.connection.db.collection('reviews');
        const usersCollection = mongoose.connection.db.collection('users');

        const reviews = await reviewsCollection.find({}).toArray();
        const me = await usersCollection.findOne({ email: 'asjadabbaszaidi@gmail.com' });

        console.log('--- My User Details ---');
        console.log('Email:', me?.email);
        console.log('ID:', me?._id, typeof me?._id);

        console.log('--- Reviews in DB ---');
        for (const review of reviews) {
            console.log(`Review ${review._id}:`);
            console.log(`  - user: ${review.user} (${typeof review.user})`);
            console.log(`  - productId: ${review.productId} (${typeof review.productId})`);
            const matchById = String(review.user) === String(me?._id);
            console.log(`  - Match with me? ${matchById}`);
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
checkReviewTypes();
