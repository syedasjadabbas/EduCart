const Product = require('../models/Product');
const Order = require('../models/Order');

// A basic rule-based NLP parser
const parseIntent = (message) => {
    const lowerMessage = message.toLowerCase();

    // 1. FAQ Automation
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return { intent: 'faq_shipping' };
    }
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return { intent: 'faq_return' };
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
        return { intent: 'faq_payment' };
    }

    // 2. Order Tracking
    if (lowerMessage.includes('where is my order') || lowerMessage.includes('track') || lowerMessage.includes('order status')) {
        return { intent: 'track_order' };
    }

    // 4. Cart Assistance
    if (lowerMessage.includes('add') && lowerMessage.includes('cart')) {
        return { intent: 'cart_add', original: message };
    }
    if (lowerMessage.includes('remove') && lowerMessage.includes('cart')) {
        return { intent: 'cart_remove' };
    }
    if (lowerMessage.includes('checkout') || lowerMessage.includes('abandoned')) {
        return { intent: 'cart_checkout' };
    }

    // 3. Product Discovery & Recommendations
    return { intent: 'search_products', original: message };
};

// 1 & 2. Main Chatbot Endpoint
const handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const parsed = parseIntent(message);

        switch (parsed.intent) {
            case 'faq_shipping':
                return res.json({
                    type: 'text',
                    message: "📦 **Shipping Information:**\n\n• Standard Shipping: 3-5 business days (PKR 150)\n• Express Shipping: 1-2 business days (PKR 300)\n• FREE shipping on orders over PKR 5000!\n\nWe deliver anywhere in Pakistan using reliable courier services."
                });
            case 'faq_return':
                return res.json({
                    type: 'text',
                    message: "🔄 **Return Policy:**\n\n• You can return items within 7 days of delivery.\n• Items must be unused and in original packaging.\n• For defective items, we offer a 100% refund or free replacement.\n\nNeed to return something? Go to 'My Orders' and click 'Request Return'."
                });
            case 'faq_payment':
                return res.json({
                    type: 'text',
                    message: "💳 **Payment Methods:**\n\nWe offer secure payments via:\n• Cash on Delivery (COD)\n• Credit/Debit Cards (Visa/Mastercard)\n• PayPal Integration\n• EasyPaisa & JazzCash\n\nAll transactions are securely encrypted."
                });
            case 'track_order':
                if (!userId) {
                    return res.json({
                        type: 'text',
                        message: "Please log in to track your orders, or provide an order number (not supported currently without login)."
                    });
                }
                const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(3);
                if (orders.length === 0) {
                    return res.json({
                        type: 'text',
                        message: "I couldn't find any recent orders for your account."
                    });
                }
                return res.json({
                    type: 'orders',
                    message: "Here are your most recent orders:",
                    data: orders
                });
            
            case 'cart_add':
            case 'cart_remove':
            case 'cart_checkout':
                return res.json({
                    type: 'action',
                    actionType: parsed.intent,
                    message: parsed.intent === 'cart_add' 
                        ? "You want to add an item. Just click 'Add to Cart' on the product you like!"
                        : parsed.intent === 'cart_checkout' 
                        ? "Ready to checkout? You can go to your Cart to complete payment." 
                        : "You can manage your items directly in your Cart.",
                    data: null
                });

            case 'search_products':
            default:
                // Simple search logic
                // Try to extract price filter (e.g. "under 5000", "below 100")
                let query = {};
                let priceMatch = message.match(/(under|below|less than)\s*(\d+)/i);
                if (priceMatch && priceMatch[2]) {
                    query.price = { $lt: parseInt(priceMatch[2]) };
                } else {
                    priceMatch = message.match(/(over|above|more than)\s*(\d+)/i);
                    if (priceMatch && priceMatch[2]) {
                        query.price = { $gt: parseInt(priceMatch[2]) };
                    }
                }

                // Extract keywords by removing generic words
                let keywords = message.replace(/(under|below|less than|over|above|more than)\s*\d+/ig, '')
                                .replace(/(show|me|find|search|for|i|want|need|looking|some|any|products)/ig, '')
                                .trim();

                if (keywords) {
                    // split and construct $or for name, category
                    const words = keywords.split(' ').filter(w => w.length > 2);
                    if (words.length > 0) {
                        const regexs = words.map(w => new RegExp(w, 'i'));
                        query.$or = [
                            { name: { $in: regexs } },
                            { category: { $in: regexs } },
                            { description: { $in: regexs } }
                        ];
                    }
                }

                // If it's a recommendation based on history (keyword "recommend")
                if (message.toLowerCase().includes('recommend')) {
                    // Fetch highest rated or random products
                    const recommended = await Product.find({}).sort({ ratings: -1 }).limit(4);
                    return res.json({
                        type: 'products',
                        message: "Here are some top-rated products we recommend:",
                        data: recommended
                    });
                }

                const products = await Product.find(query).limit(5);

                if (products.length > 0) {
                    return res.json({
                        type: 'products',
                        message: `I found ${products.length} products matching your criteria:`,
                        data: products
                    });
                } else {
                    return res.json({
                        type: 'text',
                        message: "I couldn't find any products matching your description. Could you try different keywords?"
                    });
                }
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};

const getAutocomplete = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        const products = await Product.find({
            name: { $regex: q, $options: 'i' }
        }).select('name').limit(5);

        // Can also add FAQ common questions
        const suggestions = products.map(p => p.name);
        if ("shipping".includes(q.toLowerCase())) suggestions.push("How much is shipping?");
        if ("track".includes(q.toLowerCase())) suggestions.push("Track my order");

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suggestions' });
    }
};

// Endpoint for Recommended (Customers also bought)
const getRecommendations = async (req, res) => {
    try {
        const { productId, viewedIds } = req.query;
        
        let recommended = [];
        const seenIds = new Set();
        if (productId) seenIds.add(productId);

        if (productId) {
            // Find products in similar category
            const product = await Product.findById(productId);
            if (product) {
                const similar = await Product.find({ 
                    category: product.category, 
                    _id: { $ne: productId } 
                }).limit(4);
                
                similar.forEach(p => {
                    recommended.push(p);
                    seenIds.add(p._id.toString());
                });
            }
        }
        
        // Add from browsing history if available
        if (viewedIds && recommended.length < 4) {
            try {
                const ids = JSON.parse(viewedIds);
                if (Array.isArray(ids)) {
                    const history = await Product.find({ _id: { $in: ids } }).limit(4);
                    history.forEach(p => {
                        if (!seenIds.has(p._id.toString())) {
                            recommended.push(p);
                            seenIds.add(p._id.toString());
                        }
                    });
                }
            } catch (e) {
                // ignore json parse error
            }
        }

        if (recommended.length < 4) {
            // fallback top selling/rated
            const fallback = await Product.find({ _id: { $nin: Array.from(seenIds) } }).sort({ numReviews: -1 }).limit(4 - recommended.length);
            recommended = recommended.concat(fallback);
        }

        res.json(recommended.slice(0, 4));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

module.exports = {
    handleChat,
    getAutocomplete,
    getRecommendations
};
