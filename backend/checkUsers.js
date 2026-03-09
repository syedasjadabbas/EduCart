const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

mongoose.connect(MONGO_URI).then(async () => {
    const users = await User.find({}).select('name email isEmailVerified emailVerificationToken emailVerificationExpire createdAt');
    console.log('All users:');
    users.forEach(u => {
        console.log('---');
        console.log('Name:', u.name);
        console.log('Email:', u.email);
        console.log('isEmailVerified:', u.isEmailVerified);
        console.log('hasToken:', !!u.emailVerificationToken);
        console.log('tokenExpiry:', u.emailVerificationExpire);
        console.log('tokenExpired:', u.emailVerificationExpire ? u.emailVerificationExpire < new Date() : 'N/A');
        console.log('createdAt:', u.createdAt);
    });
    mongoose.disconnect();
}).catch(e => console.error(e));
