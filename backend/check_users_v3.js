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

const checkUsers = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';
        await mongoose.connect(uri);
        console.log('Connected to DB:', uri);
        const users = await User.find({}, 'name email role');
        console.log('--- Current Users in System ---');
        users.forEach(u => {
            console.log(`${u.name} (${u.email}) -> Role: ${u.role}`);
        });
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkUsers();
