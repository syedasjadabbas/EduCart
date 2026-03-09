const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

mongoose.connect(MONGO_URI).then(async () => {
    const result = await User.updateMany(
        { isEmailVerified: { $ne: true } },
        { $set: { isEmailVerified: true } }
    );
    console.log('Updated ' + result.modifiedCount + ' existing user(s) to verified.');
    mongoose.disconnect();
}).catch(e => console.error(e));
