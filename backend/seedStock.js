const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

mongoose.connect(MONGO_URI).then(async () => {
    const result = await Product.updateMany({}, { $set: { stock: 500 } });
    console.log(`Set stock=500 for ${result.modifiedCount} products.`);
    mongoose.disconnect();
}).catch(e => console.error(e));
