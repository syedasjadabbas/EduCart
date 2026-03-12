const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Newsletter = require('../models/Newsletter');
const sendEmail = require('../utils/sendEmail');
const upload = require('../middleware/upload');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        let product;
        if (isObjectId) {
            product = await Product.findById(req.params.id);
        }
        if (!product) {
            // Fallback to searching by slug
            product = await Product.findOne({ slug: req.params.id });
        }
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, stock, oldPrice, discount, seoTitle, seoDescription, seoKeywords, slug } = req.body;
        
        let generatedSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'sample-product');

        const product = new Product({
            name: name || 'Sample Product',
            description: description || 'Sample Description',
            price: price || 0,
            category: category || 'stationery',
            stock: stock || 0,
            oldPrice: oldPrice || 0,
            discount: discount || 0,
            seoTitle: seoTitle || '',
            seoDescription: seoDescription || '',
            seoKeywords: seoKeywords ? (Array.isArray(seoKeywords) ? seoKeywords : seoKeywords.split(',').map(k => k.trim())) : [],
            slug: generatedSlug,
            image: req.file ? `/uploads/${req.file.filename}` : 'https://placehold.co/800x800/e2e8f0/1e293b?text=New+Product'
        });
        const createdProduct = await product.save();

        // Notify newsletter subscribers
        try {
            const subscribers = await Newsletter.find({});
            if (subscribers.length > 0) {
                const productImage = createdProduct.image;
                const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #2563eb; margin: 0;">EduCart</h1>
                        <p style="color: #64748b; margin-top: 4px;">Student Essentials Store</p>
                    </div>
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background-color: #dbeafe; padding: 16px; border-radius: 50%;">
                            <span style="font-size: 36px;">🆕</span>
                        </div>
                    </div>
                    <h2 style="color: #2563eb; text-align: center;">New Product Alert!</h2>
                    <p style="color: #475569;">Hey there,</p>
                    <p style="color: #475569;">We just added a brand new product to our store that you might love!</p>
                    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin: 24px 0;">
                        <img src="${productImage}" alt="${createdProduct.name}" style="width: 100%; max-height: 300px; object-fit: cover;" />
                        <div style="padding: 16px;">
                            <h3 style="margin: 0 0 8px 0; color: #1e293b;">${createdProduct.name}</h3>
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">${createdProduct.description || ''}</p>
                            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #2563eb;">Rs. ${createdProduct.price}</p>
                        </div>
                    </div>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="http://localhost:5173/product/${createdProduct._id}" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">View Product</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 EduCart. All rights reserved.</p>
                </div>
                `;

                for (const sub of subscribers) {
                    sendEmail({
                        email: sub.email,
                        subject: `🆕 New Product: ${createdProduct.name} — Now on EduCart!`,
                        html: emailHtml
                    }).catch(err => console.error(`Newsletter email to ${sub.email} failed:`, err.message));
                }
            }
        } catch (notifyErr) {
            console.error('Newsletter notification error:', notifyErr.message);
        }

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ message: 'Server Error creating product' });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, stock, oldPrice, discount, seoTitle, seoDescription, seoKeywords, slug } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;
            product.discount = discount !== undefined ? discount : product.discount;
            
            if (seoTitle !== undefined) product.seoTitle = seoTitle;
            if (seoDescription !== undefined) product.seoDescription = seoDescription;
            if (slug !== undefined) product.slug = slug;
            if (seoKeywords !== undefined) {
                product.seoKeywords = Array.isArray(seoKeywords) ? seoKeywords : seoKeywords.split(',').map(k => k.trim());
            }
            if (req.file) {
                product.image = `/uploads/${req.file.filename}`;
            } else if (req.body.image) {
                product.image = req.body.image;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({ message: 'Server Error updating product' });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting product' });
    }
});

module.exports = router;
