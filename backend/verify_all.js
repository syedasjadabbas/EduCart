require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function verifyAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Force verify everyone currently in the DB just to be safe for the user
        const result = await User.updateMany({}, { $set: { isEmailVerified: true } });
        console.log(`Verified ${result.modifiedCount} existing users.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verifyAll();
