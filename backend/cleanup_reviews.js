require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function cleanupDuplicates() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection.find({}).toArray();
        const seen = new Set();
        let deleted = 0;

        for (const review of reviews) {
            const key = `${review.productId}_${review.user}`;
            if (seen.has(key)) {
                console.log(`Deleting duplicate review ${review._id} for ${key}`);
                await reviewsCollection.deleteOne({ _id: review._id });
                deleted++;
            } else {
                seen.add(key);
            }
        }

        console.log(`Cleanup complete: ${deleted} duplicates deleted.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupDuplicates();
