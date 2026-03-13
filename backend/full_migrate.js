require('dotenv').config();
const mongoose = require('mongoose');

async function fullMigration() {
    const LOCAL_URI = 'mongodb://localhost:27017/educart';
    const ATLAS_URI = process.env.MONGO_URI;

    if (!ATLAS_URI) {
        console.error('ATLAS_URI not found in environment variables.');
        process.exit(1);
    }

    try {
        console.log('--- STARTING COMPREHENSIVE MIGRATION ---');

        // 1. Connect and Fetch LOCAL Data
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('Connected to Local MongoDB.');

        const collections = ['users', 'products', 'orders', 'reviews', 'coupons', 'newsletters'];
        const data = {};

        for (const collName of collections) {
            data[collName] = await localConn.db.collection(collName).find({}).toArray();
            console.log(`- Fetched ${data[collName].length} ${collName} from Local.`);
        }
        await localConn.close();

        // 2. Connect to ATLAS and Push Data
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('Connected to Atlas MongoDB.');

        for (const collName of collections) {
            console.log(`- Migrating ${collName}...`);
            await atlasConn.db.collection(collName).deleteMany({});
            if (data[collName].length > 0) {
                await atlasConn.db.collection(collName).insertMany(data[collName]);
            }
            console.log(`  Done! Pushed ${data[collName].length} ${collName}.`);
        }

        await atlasConn.close();
        console.log('--- MIGRATION COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error('MIGRATION FAILED:', err);
        process.exit(1);
    }
}

fullMigration();
