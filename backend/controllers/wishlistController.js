const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get logged in user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }
        
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add or remove item from wishlist
// @route   POST /api/wishlist
// @access  Private
const toggleWishlistItem = async (req, res) => {
    try {
        const { productId } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }
        
        const productExists = wishlist.products.find(p => p.toString() === productId);
        let action = '';
        
        if (productExists) {
            // Remove
            wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
            action = 'removed';
        } else {
            // Add
            wishlist.products.push(productId);
            action = 'added';
        }
        
        await wishlist.save();
        const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        
        res.json({ wishlist: updatedWishlist, action });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    toggleWishlistItem
};
