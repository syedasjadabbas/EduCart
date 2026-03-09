require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function checkUserState() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const Review = mongoose.model('Review', new mongoose.Schema({ user: mongoose.Schema.Types.Mixed, productId: mongoose.Schema.Types.Mixed }));

        const user = await User.findOne({ email: 'asjadabbaszaidi@gmail.com' });
        if (!user) {
            console.log('User not found!');
            process.exit(0);
        }

        console.log('User ID:', user._id);
        console.log('User Role:', user.role);

        const reviews = await Review.find({ user: user._id });
        console.log(`Found ${reviews.length} reviews for this user ID (ObjectId).`);

        const reviewsAsString = await Review.find({ user: user._id.toString() });
        console.log(`Found ${reviewsAsString.length} reviews for this user ID (String).`);

        const allReviews = await Review.find({});
        console.log(`Total reviews in DB: ${allReviews.length}`);
        if (allReviews.length > 0) {
            console.log('Sample Review User ID:', allReviews[0].user, typeof allReviews[0].user);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkUserState();
