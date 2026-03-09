require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function finalSync() {
    try {
        await mongoose.connect(MONGO_URI);
        const usersCollection = mongoose.connection.db.collection('users');
        const reviewsCollection = mongoose.connection.db.collection('reviews');

        const me = await usersCollection.findOne({ email: 'asjadabbaszaidi@gmail.com' });
        if (!me) {
            console.log('User asjadabbaszaidi@gmail.com not found!');
            process.exit(0);
        }

        console.log('Real User ID:', me._id, typeof me._id);

        const myReviews = await reviewsCollection.find({ user: me._id }).toArray();
        console.log(`Found ${myReviews.length} reviews matching your true ObjectId.`);

        const myReviewsStr = await reviewsCollection.find({ user: String(me._id) }).toArray();
        console.log(`Found ${myReviewsStr.length} reviews matching your true ID as a string.`);

        // If there are zero reviews, maybe the user hasn't successfully submitted any?
        if (myReviews.length === 0 && myReviewsStr.length === 0) {
            console.log('No reviews found for this user. Maybe they submitted with a different account?');
        }

        // Check if there are reviews with IDs like "5008909d3e3"
        const weirdReviews = await reviewsCollection.find({ user: '5008909d3e3' }).toArray();
        console.log(`Found ${weirdReviews.length} reviews for weird ID "5008909d3e3". Mapping them to your real ID now for testing.`);

        if (weirdReviews.length > 0) {
            await reviewsCollection.updateMany({ user: '5008909d3e3' }, { $set: { user: me._id } });
            console.log('Remapped!');
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
finalSync();
