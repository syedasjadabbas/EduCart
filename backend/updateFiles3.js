const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/educart').then(async () => {
    try {
        await Product.updateOne(
            { name: /Laptop Stand/i },
            { $set: { image: 'https://images.unsplash.com/photo-1627308595229-7830f5c91f4f?q=80&w=800&auto=format&fit=crop' } }
        );
        await Product.updateOne(
            { name: /Premium Notebook/i },
            { $set: { image: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=800&auto=format&fit=crop' } } // A nice notebook picture
        );
        await Product.updateOne(
            { name: /Lanyard/i },
            { $set: { image: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?q=80&w=800&auto=format&fit=crop' } } // Lanyard/ID type image
        );
        await Product.updateOne(
            { name: /Lamp/i },
            { $set: { image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=800&auto=format&fit=crop' } } // Desk lamp
        );
        await Product.updateOne(
            { name: /USB-C/i },
            { $set: { image: 'https://images.unsplash.com/photo-1600000784962-d2f627685c7c?q=80&w=800&auto=format&fit=crop' } } // USB hub/dongle
        );
        await Product.updateOne(
            { name: /Scissors/i },
            { $set: { image: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?q=80&w=800&auto=format&fit=crop' } } // Scissors
        );

        console.log('Images successfully updated');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
