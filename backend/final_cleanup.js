require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function finalCleanup() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection.find({}).toArray();
        const seen = new Set();
        let deleted = 0;

        for (const review of reviews) {
            // Normalize ID strings for key
            const pidString = review.productId ? String(review.productId) : 'null';
            const uidString = review.user ? String(review.user) : 'null';
            const key = `${pidString}_${uidString}`;

            if (seen.has(key)) {
                console.log(`Deleting duplicate entry ${review._id} for ${key}`);
                await reviewsCollection.deleteOne({ _id: review._id });
                deleted++;
            } else {
                seen.add(key);
            }
        }

        console.log(`Final cleanup complete: ${deleted} entries deleted.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
finalCleanup();
