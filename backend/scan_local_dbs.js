const mongoose = require('mongoose');

async function scanLocalDbs() {
    try {
        const client = await mongoose.connect('mongodb://localhost:27017');
        const admin = mongoose.connection.client.db().admin();
        const dbs = await admin.listDatabases();
        
        console.log('--- AVAILABLE LOCAL DATABASES ---');
        for (let db of dbs.databases) {
            console.log(`- ${db.name}`);
            const currentDb = mongoose.connection.client.db(db.name);
            const collections = await currentDb.listCollections().toArray();
            for (let coll of collections) {
                const count = await currentDb.collection(coll.name).countDocuments();
                console.log(`  * ${coll.name}: ${count} records`);
                if (coll.name === 'products' && count > 0) {
                     const sample = await currentDb.collection('products').find({}).limit(3).toArray();
                     sample.forEach(p => console.log(`    - Product: ${p.name}`));
                }
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
scanLocalDbs();
