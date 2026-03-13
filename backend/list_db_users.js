require('dotenv').config();
const mongoose = require('mongoose');

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        
        console.log('--- USERS IN DATABASE ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Name: ${u.name}, Verified: ${u.isEmailVerified}, Role: ${u.role}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listUsers();
