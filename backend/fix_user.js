require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function fixUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const user = await User.findOneAndUpdate(
            { email: 'asjadabbaszaidi@gmail.com' },
            {
                password: hashedPassword,
                role: 'admin',
                isEmailVerified: true // Make sure they are verified!
            },
            { new: true }
        );

        if (user) {
            console.log('User asjadabbaszaidi@gmail.com fixed: password set to admin123, role to admin, and verified.');
        } else {
            console.log('User not found!');
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixUser();
