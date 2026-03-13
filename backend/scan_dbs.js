require('dotenv').config();
const mongoose = require('mongoose');

async function scanDatabases() {
    try {
        const client = await mongoose.connect(process.env.MONGO_URI);
        const admin = mongoose.connection.client.db().admin();
        const dbs = await admin.listDatabases();
        
        console.log('--- AVAILABLE DATABASES ---');
        for (let db of dbs.databases) {
            console.log(`- ${db.name}`);
            const currentDb = mongoose.connection.client.db(db.name);
            const collections = await currentDb.listCollections().toArray();
            if (collections.some(c => c.name === 'users')) {
                const count = await currentDb.collection('users').countDocuments();
                console.log(`  (Contains 'users' collection with ${count} records)`);
                if (count > 1) {
                    const sample = await currentDb.collection('users').find({}).limit(5).toArray();
                    sample.forEach(u => console.log(`    * ${u.email}`));
                }
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
scanDatabases();
