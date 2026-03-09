const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const findUser = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/educart');
        console.log('--- USER LIST ---');

        const users = await User.find({});
        users.forEach(u => {
            console.log(`- ${u.email} -> ${u._id} (Name: ${u.name}, Role: ${u.role})`);
        });

        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

findUser();
