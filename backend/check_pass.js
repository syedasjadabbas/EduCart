require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkPass() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        const user = await User.findOne({ email: 'asjadabbaszaidi@gmail.com' });
        if (!user) {
            console.log('USER_NOT_FOUND');
            process.exit(0);
        }

        console.log('Found user:', user.email);
        console.log('Role:', user.role);
        console.log('Verified:', user.isEmailVerified);

        const isMatch = await bcrypt.compare('admin123', user.password);
        console.log('Password "admin123" matches?', isMatch);

        if (!isMatch) {
            const salt = await bcrypt.genSalt(10);
            user.password = 'admin123'; // Assigning plain text, pre-save hook will hash it
            await user.save();
            console.log('Reset password to admin123 via user.save()');
            const newMatch = await bcrypt.compare('admin123', user.password);
            console.log('New match check:', newMatch);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkPass();
