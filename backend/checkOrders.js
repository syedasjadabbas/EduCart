const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

mongoose.connect(MONGO_URI).then(async () => {
    const orders = await Order.find({}).select('contactInfo user createdAt totalPrice');
    console.log('Total orders in DB:', orders.length);
    orders.forEach(o => {
        console.log('---');
        console.log('ID:', o._id);
        console.log('contactInfo.email:', o.contactInfo?.email);
        console.log('user:', o.user);
        console.log('total:', o.totalPrice);
        console.log('created:', o.createdAt);
    });
    mongoose.disconnect();
}).catch(e => console.error(e));
