const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const fixOrderItemsDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
        console.log('Connected to MongoDB');

        // Fix Orders (OrderItems images)
        // Find all orders
        const orders = await Order.find();
        let modifiedCount = 0;

        for (let order of orders) {
            let changed = false;
            if (order.orderItems && Array.isArray(order.orderItems)) {
                for (let item of order.orderItems) {
                    if (item.image && typeof item.image === 'string' && item.image.includes('http://localhost:5000')) {
                        item.image = item.image.replace('http://localhost:5000', '');
                        changed = true;
                    }
                }
            }
            if (changed) {
                // Must mark modified if it's an array of subdocuments in some mongoose versions, or just save
                order.markModified('orderItems');
                await order.save();
                modifiedCount++;
            }
        }

        console.log(`Successfully fixed ${modifiedCount} orders with hardcoded localhost in orderItems.`);
        process.exit();
    } catch (error) {
        console.error('Error fixing database order items:', error);
        process.exit(1);
    }
};

fixOrderItemsDb();
