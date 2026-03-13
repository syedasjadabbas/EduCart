require('dotenv').config();
const mongoose = require('mongoose');

async function debugUsers() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in DB:', collections.map(c => c.name));

        const usersRaw = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('Count of users found raw:', usersRaw.length);
        usersRaw.forEach(u => {
            console.log(`- Raw Email: "${u.email}" (Length: ${u.email?.length})`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
debugUsers();
