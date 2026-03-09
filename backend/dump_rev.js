require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function dumpReviews() {
    try {
        await mongoose.connect(MONGO_URI);
        const Review = db = mongoose.connection.collection('reviews');
        const allReviews = await db.find({}).toArray();
        console.log('REVIEWS_DUMP_START');
        console.log(JSON.stringify(allReviews));
        console.log('REVIEWS_DUMP_END');
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
dumpReviews();
