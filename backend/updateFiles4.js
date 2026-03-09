const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/educart').then(async () => {
    try {
        await Product.updateOne(
            { name: /Laptop Stand Aluminum/i },
            { $set: { image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' } }
        );
        await Product.updateOne(
            { name: /Premium Notebook Set/i },
            { $set: { image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&h=300&fit=crop' } }
        );
        await Product.updateOne(
            { name: /USB-C Hub/i },
            { $set: { image: 'https://plus.unsplash.com/premium_photo-1726837308560-cb371e1cbb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' } }
        );

        console.log('Images successfully restored to verified pictures');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
