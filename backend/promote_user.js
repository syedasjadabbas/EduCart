const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({
    email: String,
    role: String,
    name: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const promoteUser = async (email) => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`Success: ${email} is now an ADMIN.`);
        } else {
            console.log(`Error: User with email ${email} not found.`);
        }
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

// Promote the user's account
promoteUser('asjadabbaszaidi@gmail.com');
