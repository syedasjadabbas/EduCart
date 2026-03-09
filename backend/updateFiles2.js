const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/educart').then(async () => {
    try {
        await Product.updateOne(
            { name: /Premium Notebook Set/i },
            { $set: { image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop' } }
        );
        await Product.updateOne(
            { name: /Gel Pen Pack/i },
            { $set: { image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=800&auto=format&fit=crop' } }
        );
        await Product.updateOne(
            { name: /Canvas Messenger Bag/i },
            { $set: { image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' } }
        );
        console.log('Images successfully updated');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
