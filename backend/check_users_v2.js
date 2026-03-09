const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// Define a minimal User schema for the check
const userSchema = new mongoose.Schema({
    email: String,
    role: String,
    name: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const checkUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
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
