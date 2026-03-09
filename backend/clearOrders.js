const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

mongoose.connect(MONGO_URI).then(async () => {
    const result = await Order.deleteMany({});
    console.log('Deleted ' + result.deletedCount + ' test orders.');
    mongoose.disconnect();
}).catch(e => console.error(e));
