require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/educart').then(async () => {
    const ps = await Product.find({}, 'name slug _id').lean();
    ps.forEach(p => console.log(`${p._id} | ${p.slug} | ${p.name}`));
    console.log(`\nTotal: ${ps.length} products`);
    process.exit();
}).catch(e => { console.error(e); process.exit(1); });
