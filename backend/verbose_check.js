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
            console.log('USER_NOT_FOUND');
            process.exit(0);
        }

        console.log('--- USER DATA ---');
        console.log('ID:', user._id);
        console.log('EMAIL:', user.email);
        console.log('ROLE:', user.role);

        console.log('--- REVIEW DATA ---');
        const reviewsById = await Review.find({ user: user._id });
        console.log('REVIEWS_BY_OBJECTID:', reviewsById.length);

        const reviewsByString = await Review.find({ user: user._id.toString() });
        console.log('REVIEWS_BY_STRING:', reviewsByString.length);

        const allReviews = await Review.find({});
        console.log('TOTAL_REVIEWS:', allReviews.length);
        if (allReviews.length > 0) {
            console.log('FIRST_REVIEW_USER:', allReviews[0].user, typeof allReviews[0].user);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkUserState();
