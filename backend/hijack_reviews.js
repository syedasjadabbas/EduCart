require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Review = require('./models/Review');

async function hijackReviews() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        const user = await User.findOne({ email: 'asjadabbaszaidi@gmail.com' });
        if (!user) {
            console.log('USER_NOT_FOUND');
            process.exit(0);
        }

        const result = await Review.updateMany({}, { $set: { user: user._id } });
        console.log(`Mapped ${result.modifiedCount} reviews to ${user.email}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
hijackReviews();
