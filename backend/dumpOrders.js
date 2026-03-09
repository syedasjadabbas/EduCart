const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const dumpOrders = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/educart');
        console.log('Connected to MongoDB');

        const orders = await Order.find({});
        console.log(`Total Orders in DB: ${orders.length}`);

        for (const o of orders) {
            console.log(`- Order: ${o._id}`);
            console.log(`  User ID Ref: ${o.user}`);
            console.log(`  Contact Email: ${o.contactInfo?.email}`);
            console.log(`  Status: Shipped=${o.isShipped}, Delivered=${o.isDelivered}, Received=${o.isReceivedByUser}`);
            console.log(`  Payment: ${o.paymentStatus}`);
        }

        process.exit();
    } catch (err) {
        console.error('Error during dumpOrders:', err);
        process.exit(1);
    }
};

dumpOrders();
