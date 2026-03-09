require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const reviewsCollection = db.collection('reviews');
        const productsCollection = db.collection('products');

        const reviews = await reviewsCollection.find({}).toArray();
        console.log(`Found ${reviews.length} reviews.`);

        let converted = 0;
        let deleted = 0;

        for (const review of reviews) {
            let pid = review.productId;

            // If it's already an ObjectId, skip
            if (pid instanceof mongoose.Types.ObjectId) continue;

            // Try to find a product with this ID (either as hex string or mock ID)
            let product;
            if (mongoose.Types.ObjectId.isValid(pid)) {
                product = await productsCollection.findOne({ _id: new mongoose.Types.ObjectId(pid) });
            } else {
                // It's a mock ID like "2" or "1"
                // We should probably map it to a real product or delete it if testing
                // For now, let's see if we can find any product at all to link it to, 
                // or just keep it as is if we can't.
                // Actually, if it's "2", we can't easily map it unless we know which product it was.
            }

            if (product) {
                await reviewsCollection.updateOne(
                    { _id: review._id },
                    { $set: { productId: product._id } }
                );
                converted++;
            } else if (typeof pid === 'string' && pid.length < 12) {
                // Likely a legacy mock ID that doesn't exist in DB
                // Better to delete it to keep DB clean
                await reviewsCollection.deleteOne({ _id: review._id });
                deleted++;
            } else if (typeof pid === 'string' && mongoose.Types.ObjectId.isValid(pid)) {
                // It's a valid hex string but not an ObjectId type
                await reviewsCollection.updateOne(
                    { _id: review._id },
                    { $set: { productId: new mongoose.Types.ObjectId(pid) } }
                );
                converted++;
            }
        }

        console.log(`Migration complete: ${converted} converted, ${deleted} deleted.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
