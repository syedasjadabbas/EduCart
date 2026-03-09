const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/educart').then(async () => {
    try {
        await Product.updateOne(
            { name: /Soft Grip Scissors/i },
            { $set: { image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop' } }
        );
        await Product.updateOne(
            { name: /Canvas Messenger/i },
            { $set: { image: 'https://plus.unsplash.com/premium_photo-1678739395192-bf20372f5db5?q=80&w=800&auto=format&fit=crop' } }
        );
        console.log('Images successfully updated');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
