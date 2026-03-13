require('dotenv').config();
const mongoose = require('mongoose');

async function reverseSync() {
    const LOCAL_URI = 'mongodb://localhost:27017/educart';
    const ATLAS_URI = process.env.MONGO_URI;

    if (!ATLAS_URI) {
        console.error('Error: MONGO_URI not found in environment variables.');
        process.exit(1);
    }

    try {
        console.log('--- STARTING REVERSE SYNC (Atlas -> Local) ---');

        // 1. Connect and Fetch ATLAS Data
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('Connected to Atlas MongoDB.');

        const collections = ['users', 'products', 'orders', 'reviews', 'coupons', 'newsletters'];
        const data = {};

        for (const collName of collections) {
            data[collName] = await atlasConn.db.collection(collName).find({}).toArray();
            console.log(`- Fetched ${data[collName].length} ${collName} from Atlas.`);
        }
        await atlasConn.close();

        // 2. Connect to LOCAL and Push Data
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('Connected to Local MongoDB.');

        for (const collName of collections) {
            console.log(`- Updating Local ${collName}...`);
            await localConn.db.collection(collName).deleteMany({});
            if (data[collName].length > 0) {
                await localConn.db.collection(collName).insertMany(data[collName]);
            }
            console.log(`  Done! Updated ${data[collName].length} local ${collName}.`);
        }

        await localConn.close();
        console.log('--- REVERSE SYNC COMPLETE ---');
        console.log('Your local database now perfectly matches the live site.');
        process.exit(0);
    } catch (err) {
        console.error('REVERSE SYNC FAILED:', err);
        process.exit(1);
    }
}

reverseSync();
