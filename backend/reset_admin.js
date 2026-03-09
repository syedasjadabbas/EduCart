require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await User.findOneAndUpdate(
            { email: 'admin@educart.com' },
            { password: hashedPassword, role: 'admin' },
            { new: true }
        );

        if (admin) {
            console.log('Admin password reset to admin123');
        } else {
            console.log('Admin user not found. Creating one...');
            await User.create({
                name: 'Admin User',
                email: 'admin@educart.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created with password admin123');
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
resetAdmin();
