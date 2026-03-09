const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({
    email: String,
    role: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const lockAdminRoles = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // 1. Demote asjadabbaszaidi@gmail.com back to student
        await User.findOneAndUpdate(
            { email: 'asjadabbaszaidi@gmail.com' },
            { role: 'student' }
        );
        console.log('asjadabbaszaidi@gmail.com role set to student.');

        // 2. Ensure admin@educart.com is the only admin
        await User.findOneAndUpdate(
            { email: 'admin@educart.com' },
            { role: 'admin' }
        );
        console.log('admin@educart.com role confirmed as ADMIN.');

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

lockAdminRoles();
