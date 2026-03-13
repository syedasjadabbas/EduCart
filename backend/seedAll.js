require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/educart';

if (!process.env.MONGO_URI) {
    console.warn('WARNING: MONGO_URI is not defined in your .env file. Falling back to local MongoDB.');
}

// Function to generate slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

async function seedProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected successfully.');

        // 1. Get mock data from frontend
        const mockFilePath = path.join(__dirname, '../frontend/src/data/mockProducts.js');
        if (!fs.existsSync(mockFilePath)) {
            throw new Error(`Mock products file not found at ${mockFilePath}`);
        }

        let content = fs.readFileSync(mockFilePath, 'utf8');
        // Convert ESM export to CommonJS for this script
        content = content.replace('export const mockProducts = ', 'module.exports = ');
        
        const tempPath = path.join(__dirname, 'temp_products_data.js');
        fs.writeFileSync(tempPath, content);
        
        const mockProducts = require('./temp_products_data.js');
        fs.unlinkSync(tempPath);

        console.log(`Found ${mockProducts.length} products in mock data.`);

        // 2. Prepare data (remove manually set _id if it's a string like '1', '2' and let Mongo handle it, or keep if we want stable IDs)
        // Here we'll keep them but ensure slug exists
        const preparedProducts = mockProducts.map(p => {
            const { _id, ...rest } = p;
            return {
                ...rest,
                slug: rest.slug || generateSlug(rest.name),
                stock: rest.stock || 500,
                ratings: rest.ratings || 0,
                numReviews: rest.numReviews || 0
            };
        });

        // 3. Clear and Seed
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        
        console.log('Inserting products...');
        await Product.insertMany(preparedProducts);

        console.log('SUCCESS: Products seeded successfully!');
        const count = await Product.countDocuments();
        console.log(`Verified: ${count} products in database.`);
        
        process.exit(0);
    } catch (error) {
        console.error('SEEDING ERROR:', error.message);
        process.exit(1);
    }
}

seedProducts();
