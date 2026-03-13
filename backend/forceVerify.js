require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function forceVerify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Verify ADMIN
        const adminResult = await User.updateOne(
            { email: 'admin@educart.com' },
            { $set: { isEmailVerified: true, role: 'admin' } }
        );
        console.log('Admin Verification Result:', adminResult);

        // 2. Check for the user's gmail
        const userEmail = 'asjadabbaszaidi@gmail.com';
        const user = await User.findOne({ email: userEmail });
        
        if (user) {
            console.log(`User ${userEmail} found. Verifying now...`);
            await User.updateOne({ email: userEmail }, { $set: { isEmailVerified: true } });
            console.log('User Verified!');
        } else {
            console.log(`User ${userEmail} NOT found in database.`);
        }

        const allUsers = await User.find({}).select('email isEmailVerified role');
        console.log('--- Current Users State ---');
        allUsers.forEach(u => {
            console.log(`- ${u.email}: Verified=${u.isEmailVerified}, Role=${u.role}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
forceVerify();
