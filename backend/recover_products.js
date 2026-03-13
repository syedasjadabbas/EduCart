require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

async function recovery() {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for recovery.');

        // 1. Get the 44 product names/IDs from the dump
        const dumpPath = path.join(__dirname, 'dump_new.json');
        if (!fs.existsSync(dumpPath)) {
            console.error('dump.json not found.');
            process.exit(1);
        }
        const dumpedProducts = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
        console.log(`Analyzing ${dumpedProducts.length} products from dump.`);

        let restored = 0;
        for (const dp of dumpedProducts) {
            const existing = await Product.findOne({
                $or: [
                    { _id: dp._id },
                    { name: dp.name }
                ]
            });

            if (!existing) {
                console.log(`- Restoring missing product: ${dp.name}`);
                await Product.create({
                    _id: dp._id,
                    name: dp.name,
                    description: 'RECOVERED PLACEHOLDER: Please update details in admin panel.',
                    price: 999, // Dummy price
                    category: 'Recovered',
                    stock: 0,
                    image: dp.image || 'https://placehold.co/800x800/e2e8f0/1e293b?text=Recovered'
                });
                restored++;
            }
        }

        console.log(`RECOVERY COMPLETE: ${restored} products restored as placeholders.`);
        process.exit(0);
    } catch (err) {
        console.error('RECOVERY FAILED:', err);
        process.exit(1);
    }
}
recovery();
