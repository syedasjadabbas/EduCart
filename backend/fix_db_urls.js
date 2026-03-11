const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const fixUrls = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        console.log('Connected to MongoDB');

        // Fix Products
        const products = await Product.find({ image: { $regex: 'http://localhost:5000' } });
        console.log(`Found ${products.length} products with hardcoded URLs`);
        for (let p of products) {
            p.image = p.image.replace('http://localhost:5000', '');
            await p.save();
        }

        // Fix Users (Profile Pictures)
        const users = await User.find({ profilePicture: { $regex: 'http://localhost:5000' } });
        console.log(`Found ${users.length} users with hardcoded profile pictures`);
        for (let u of users) {
            u.profilePicture = u.profilePicture.replace('http://localhost:5000', '');
            await u.save();
        }

        // Fix Users (Student ID Cards)
        const students = await User.find({ studentIdCard: { $regex: 'http://localhost:5000' } });
        console.log(`Found ${students.length} users with hardcoded student ID cards`);
        for (let s of students) {
            s.studentIdCard = s.studentIdCard.replace('http://localhost:5000', '');
            await s.save();
        }

        // Fix Orders (Transaction Screenshots)
        const orders = await Order.find({ transactionScreenshot: { $regex: 'http://localhost:5000' } });
        console.log(`Found ${orders.length} orders with hardcoded screenshots`);
        for (let o of orders) {
            o.transactionScreenshot = o.transactionScreenshot.replace('http://localhost:5000', '');
            await o.save();
        }

        console.log('Database URL fix completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error fixing database URLs:', error);
        process.exit(1);
    }
};

fixUrls();
