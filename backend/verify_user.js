require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
    console.error('Usage: node verify_user.js <email>');
    process.exit(1);
}

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email: email.trim().toLowerCase() },
            { isEmailVerified: true },
            { new: true }
        );
        if (user) {
            console.log(`SUCCESS: ${user.email} is now verified.`);
        } else {
            console.log(`ERROR: User ${email} not found.`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verify();
