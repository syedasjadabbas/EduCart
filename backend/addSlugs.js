const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        let count = 0;
        for (let p of products) {
            if (!p.slug) {
                p.slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                p.seoTitle = p.name;
                p.seoDescription = p.description.substring(0, 150);
                p.seoKeywords = p.name.split(' ');
                await p.save();
                count++;
            }
        }
        
        console.log(`Updated ${count} products with missing SEO fields.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateSlugs();
