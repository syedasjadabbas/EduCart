require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function deepMigrate() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection.find({}).toArray();
        console.log(`Found ${reviews.length} total reviews.`);

        for (const review of reviews) {
            const updates = {};

            // Fix User ID
            if (typeof review.user === 'string' && mongoose.Types.ObjectId.isValid(review.user)) {
                updates.user = new mongoose.Types.ObjectId(review.user);
            }

            // Fix Product ID
            if (typeof review.productId === 'string') {
                if (mongoose.Types.ObjectId.isValid(review.productId)) {
                    updates.productId = new mongoose.Types.ObjectId(review.productId);
                } else {
                    // It's a mock ID like "2". Let's try to delete these as they break things.
                    console.log(`Deleting legacy review ${review._id} with invalid productId: ${review.productId}`);
                    await reviewsCollection.deleteOne({ _id: review._id });
                    continue;
                }
            }

            if (Object.keys(updates).length > 0) {
                await reviewsCollection.updateOne(
                    { _id: review._id },
                    { $set: updates }
                );
                console.log(`Updated IDs for review ${review._id}`);
            }
        }

        console.log('Deep migration complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

deepMigrate();
