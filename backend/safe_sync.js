require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function safeSync() {
    const LOCAL_URI = 'mongodb://localhost:27017/educart';
    const ATLAS_URI = process.env.MONGO_URI;

    if (!ATLAS_URI) {
        console.error('Error: MONGO_URI not found.');
        process.exit(1);
    }

    try {
        console.log('--- STARTING SAFE SYNC (Local -> Atlas) ---');

        // 1. Connect to both
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();

        // 2. Check for "Newer" data on Atlas
        console.log('Checking for more recent updates on Live site...');
        const collections = ['products', 'users', 'orders'];
        let liveHasNewerData = false;

        for (const coll of collections) {
            const localLatest = await localConn.db.collection(coll).find({}).sort({ updatedAt: -1 }).limit(1).toArray();
            const atlasLatest = await atlasConn.db.collection(coll).find({}).sort({ updatedAt: -1 }).limit(1).toArray();

            if (atlasLatest.length > 0 && localLatest.length > 0) {
                if (atlasLatest[0].updatedAt > localLatest[0].updatedAt) {
                    console.warn(`WARNING: Live ${coll} contains newer data than Local!`);
                    console.log(`- Live latest: ${atlasLatest[0].updatedAt}`);
                    console.log(`- Local latest: ${localLatest[0].updatedAt}`);
                    liveHasNewerData = true;
                }
            }
        }

        if (liveHasNewerData) {
            const answer = await ask('\n⚠️ Live site has newer data. Overwriting it will result in data loss. Continue? (y/N): ');
            if (answer.toLowerCase() !== 'y') {
                console.log('Sync aborted to protect live data.');
                process.exit(0);
            }
        }

        // 3. Perform the migration
        console.log('Proceeding with migration...');
        const allColls = ['users', 'products', 'orders', 'reviews', 'coupons', 'newsletters'];
        
        for (const collName of allColls) {
            const data = await localConn.db.collection(collName).find({}).toArray();
            console.log(`- Migrating ${collName} (${data.length} records)...`);
            await atlasConn.db.collection(collName).deleteMany({});
            if (data.length > 0) {
                await atlasConn.db.collection(collName).insertMany(data);
            }
        }

        await localConn.close();
        await atlasConn.close();
        console.log('--- SAFE SYNC COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error('SAFE SYNC FAILED:', err);
        process.exit(1);
    }
}

safeSync();
