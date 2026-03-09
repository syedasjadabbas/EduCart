const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const testGetOrders = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/educart');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'asjadabbaszaidi@gmail.com' });
        if (!user) {
            console.log('User not found.');
            process.exit();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        console.log(`Generated Token for ${user.email}: Bearer ${token}`);

        // Mock request object
        const userId = user._id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        console.log(`Found ${orders.length} orders for userId ${userId}`);

        const fallbackOrders = await Order.find({ 'contactInfo.email': user.email }).sort({ createdAt: -1 });
        console.log(`Found ${fallbackOrders.length} orders for email ${user.email} (fallback)`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testGetOrders();
