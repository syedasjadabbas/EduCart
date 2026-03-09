require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function checkProducts() {
    try {
        await mongoose.connect(MONGO_URI);
        const Product = mongoose.model('Product', new mongoose.Schema({ name: String }));
        const products = await Product.find({}).limit(5);
        console.log('--- DB Products Sample ---');
        products.forEach(p => {
            console.log(`Product: ${p.name}, ID: ${p._id} (${typeof p._id})`);
        });
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
checkProducts();
