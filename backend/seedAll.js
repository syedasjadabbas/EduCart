require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

async function seedProducts() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        // Let's read the mockProducts file using fs
        const fs = require('fs');
        const path = require('path');
        const mockFilePath = path.join(__dirname, '../frontend/src/data/mockProducts.js');

        let content = fs.readFileSync(mockFilePath, 'utf8');
        // Simple extraction since it's a module
        content = content.replace('export const mockProducts = ', 'module.exports = ');

        const tempPath = path.join(__dirname, 'tempMock.js');
        fs.writeFileSync(tempPath, content);

        const mockProducts = require('./tempMock.js');
        fs.unlinkSync(tempPath);

        let added = 0;
        let updated = 0;

        for (const item of mockProducts) {
            const { _id, ...rest } = item;

            // Just matching by name so we don't duplicate existing ones
            // but we update them
            const existing = await Product.findOne({ name: rest.name });
            if (existing) {
                await Product.updateOne({ _id: existing._id }, { $set: { ...rest, stock: rest.stock || 500 } });
                updated++;
            } else {
                await Product.create({ ...rest, stock: rest.stock || 500 });
                added++;
            }
        }

        console.log(`Success! Added ${added} new products and updated ${updated} existing ones.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seedProducts();
