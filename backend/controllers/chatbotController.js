const Product = require('../models/Product');
const Order = require('../models/Order');

// AI-like fallback responses for unknown queries
const aiResponses = [
    "That's an interesting question! While I don't have a specific answer, I can help you find products or track orders. What else can I assist you with?",
    "I'm still learning! But I can definitely help you search for products, check your orders, or answer questions about shipping and returns. What would you like to know?",
    "Great question! For the most accurate answer, please reach out to our support team. But I'm happy to help you browse our store or track your purchases!",
    "I appreciate your question! While I don't have all the details, I can help you find products or answer questions about our policies. What can I do for you?",
];

// Greeting patterns and responses
const greetings = {
    patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'what\'s up', 'howdy'],
    responses: [
        "Hey there! 👋 Welcome to EduCart! How can I help you today? I can search for products, track your orders, or answer questions about shipping and returns.",
        "Hello! 🎓 Welcome to EduCart, your student essentials store. What would you like to explore?",
        "Hi! 👋 I'm here to help. Looking for products, checking an order, or have a question about our policies?",
        "Welcome! 🛍️ What brings you to EduCart today? I'm ready to help with product searches, order tracking, or answering any questions!",
    ]
};

const cleanCartQuery = (text = '') => {
    return text
        .replace(/^(a|an|the)\s+/i, '')
        .replace(/\s+(to|into|in|from)\s+cart\s*$/i, '')
        .replace(/\s+please\s*$/i, '')
        .trim();
};

const parseCartAction = (message, mode) => {
    if (!message) return null;
    const normalized = message.trim();

    if (mode === 'add') {
        const match = normalized.match(/(?:add|put)\s+(?:(\d+)\s*(?:x|units?)?\s+)?(.+?)(?:\s+(?:to|into|in)\s+cart)?$/i);
        if (!match) return null;

        const qty = Number(match[1] || 1);
        const query = cleanCartQuery(match[2]);
        return {
            qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
            query,
        };
    }

    const removeMatch = normalized.match(/(?:remove|delete)\s+(.+?)(?:\s+from\s+cart)?$/i);
    if (!removeMatch) return null;

    return {
        query: cleanCartQuery(removeMatch[1]),
    };
};

/**
 * Enhanced rule-based NLP parser
 * Detects: greetings, FAQ, order tracking, cart actions, product search, recommendations
 */
const parseIntent = (message) => {
    const lowerMessage = message.toLowerCase().trim();

    // Check for greetings
    if (greetings.patterns.some(pattern => lowerMessage.includes(pattern))) {
        return { intent: 'greeting' };
    }

    // FAQ - Shipping & Delivery
    if (lowerMessage.match(/(shipping|delivery|how long|when will|arrive|reaches|post|courier|dispatch)/i)) {
        return { intent: 'faq_shipping' };
    }

    // FAQ - Returns & Refunds
    if (lowerMessage.match(/(return|refund|exchange|defective|damaged|wrong|broken)/i)) {
        return { intent: 'faq_return' };
    }

    // FAQ - Payment Methods
    if (lowerMessage.match(/(payment|pay|card|visa|mastercard|cod|cash|easypaise|jazz|wallet)/i)) {
        return { intent: 'faq_payment' };
    }

    // Order Tracking
    if (lowerMessage.match(/(where is|track|order status|my order|order number|order id|order update)/i)) {
        return { intent: 'track_order' };
    }

    // Product Recommendations
    if (lowerMessage.match(/(recommend|suggest|similar|related|what should|help me choose|best|top rated)/i)) {
        return { intent: 'recommend_products' };
    }

    // Cart - Add Items
    if ((lowerMessage.includes('add') || lowerMessage.includes('put')) && lowerMessage.includes('cart')) {
        return { intent: 'cart_add', original: message, cartAction: parseCartAction(message, 'add') };
    }

    // Cart - Remove Items
    if ((lowerMessage.includes('remove') || lowerMessage.includes('delete')) && lowerMessage.includes('cart')) {
        return { intent: 'cart_remove', original: message, cartAction: parseCartAction(message, 'remove') };
    }

    // Cart - Checkout
    if (lowerMessage.match(/(checkout|proceed|payment|buy|purchase)/i)) {
        return { intent: 'cart_checkout' };
    }

    // Help/Support
    if (lowerMessage.match(/(help|support|assist|customer service|contact|email|phone)/i)) {
        return { intent: 'help' };
    }

    // Product Search - Default
    return { intent: 'search_products', original: message };
};

/**
 * Get a random AI-like fallback response
 */
const getAIFallbackResponse = () => {
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
};

/**
 * Get a random greeting response
 */
const getGreetingResponse = () => {
    return greetings.responses[Math.floor(Math.random() * greetings.responses.length)];
};

/**
 * Main Chatbot Handler
 */
const handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const parsed = parseIntent(message);

        switch (parsed.intent) {
            // Greeting Intent
            case 'greeting':
                return res.json({
                    type: 'text',
                    message: getGreetingResponse()
                });

            // FAQ - Shipping
            case 'faq_shipping':
                return res.json({
                    type: 'text',
                    message: "📦 **Shipping & Delivery Information:**\n\n• **Standard Shipping**: 3-5 business days → PKR 150\n• **Express Shipping**: 1-2 business days → PKR 300\n• **FREE Shipping**: On orders over PKR 5,000\n\n✅ We deliver nationwide across Pakistan using reliable courier partners.\n\n💡 **Tip**: Track your order in 'My Orders' section once dispatched!\n\nHave more questions? Feel free to ask!"
                });

            // FAQ - Returns
            case 'faq_return':
                return res.json({
                    type: 'text',
                    message: "🔄 **Return & Refund Policy:**\n\n✅ **Return Window**: 7 days from delivery\n✅ **Condition**: Items must be unused & in original packaging\n✅ **Defective Items**: 100% refund or free replacement\n\n**How to Return:**\n1. Go to 'My Orders'\n2. Find the order\n3. Click 'Request Return'\n4. Follow the instructions\n\n💳 **Refund Timeline**: 5-7 business days after return confirmation\n\nNeed help with a return? Contact our support team!"
                });

            // FAQ - Payment
            case 'faq_payment':
                return res.json({
                    type: 'text',
                    message: "💳 **Payment Methods:**\n\nWe accept multiple secure payment options:\n\n• **Cash on Delivery (COD)** - Pay when you receive\n• **Credit/Debit Cards** - Visa, Mastercard (Secure SSL)\n• **PayPal** - Fast & international\n• **EasyPaisa** - Pakistani mobile payment\n• **Jazz Cash** - Pakistani mobile payment\n\n🔒 **Security**: All transactions are encrypted & secure.\n\n💡 **Tip**: Credit card payments often unlock exclusive discounts!\n\nAny payment issues? Let us know!"
                });

            // Order Tracking
            case 'track_order':
                if (!userId) {
                    return res.json({
                        type: 'text',
                        message: "🔐 To track your orders, please **log in** to your EduCart account.\n\nOnce logged in, go to **'My Orders'** to see status, tracking details, and delivery updates.\n\n👤 **Don't have an account?** Register now to start shopping!"
                    });
                }
                const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
                if (orders.length === 0) {
                    return res.json({
                        type: 'text',
                        message: "📭 You don't have any orders yet! Ready to make your first purchase? Check out our **Shop** for amazing student essentials! 🛍️"
                    });
                }
                return res.json({
                    type: 'orders',
                    message: "📦 **Your Recent Orders:**",
                    data: orders
                });

            // Product Recommendations
            case 'recommend_products':
                try {
                    const topProducts = await Product.find({})
                        .sort({ ratings: -1, numReviews: -1 })
                        .limit(6);
                    
                    if (topProducts.length > 0) {
                        return res.json({
                            type: 'products',
                            message: "⭐ **Top Recommendations for You:**\n\nHere are our most loved products by EduCart customers:",
                            data: topProducts.slice(0, 4)
                        });
                    }
                } catch (e) {
                    console.error('Recommendation error:', e);
                }
                return res.json({
                    type: 'text',
                    message: "💡 **Trending Now**: Browse our shop to see what other students are loving! What category interests you?"
                });

            // Help & Support
            case 'help':
                return res.json({
                    type: 'text',
                    message: "🆘 **Need Help?**\n\nI can assist you with:\n\n✅ **Product Search** - \"Show me gaming laptops\"\n✅ **Pricing Filters** - \"Products under 5000\"\n✅ **Order Tracking** - \"Where's my order?\"\n✅ **FAQ** - Shipping, returns, payments\n✅ **Cart Management** - Add/remove items\n✅ **Recommendations** - \"What should I buy?\"\n\n📧 **Direct Support**: Contact our team for urgent issues\n\nWhat can I help you with?"
                });

            // Cart - Add
            case 'cart_add':
                if (parsed.cartAction?.query) {
                    const escaped = parsed.cartAction.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const product = await Product.findOne({ 
                        $or: [
                            { name: { $regex: escaped, $options: 'i' } },
                            { category: { $regex: escaped, $options: 'i' } },
                            { description: { $regex: escaped, $options: 'i' } }
                        ]
                    });

                    if (product) {
                        return res.json({
                            type: 'action',
                            actionType: 'cart_add',
                            message: `✅ Found **${product.name}** for PKR ${product.price}.\n\nI'll add ${parsed.cartAction.qty} to your cart. Ready?`,
                            data: {
                                qty: parsed.cartAction.qty,
                                product,
                            },
                        });
                    }
                }

                return res.json({
                    type: 'action',
                    actionType: 'cart_add',
                    message: "🛒 **Add to Cart**\n\nTell me what you'd like:\n• \"Add 2 notebooks\"\n• \"Add gaming laptop\"\n• \"Put headphones in cart\"\n\nOr browse products below! 👇",
                    data: parsed.cartAction?.query
                        ? { qty: parsed.cartAction.qty || 1, productQuery: parsed.cartAction.query }
                        : null,
                });

            // Cart - Remove
            case 'cart_remove':
                return res.json({
                    type: 'action',
                    actionType: 'cart_remove',
                    message: parsed.cartAction?.query
                        ? `🗑️ I'll remove **${parsed.cartAction.query}** from your cart.`
                        : "🗑️ **Remove from Cart**\n\nTell me what to remove:\n• \"Remove notebook\"\n• \"Delete headphones\"\n• \"Remove laptop from cart\"",
                    data: parsed.cartAction?.query
                        ? { productQuery: parsed.cartAction.query }
                        : null,
                });

            // Cart - Checkout
            case 'cart_checkout':
                return res.json({
                    type: 'action',
                    actionType: 'cart_checkout',
                    message: "🛍️ **Ready to Checkout?**\n\nLet's complete your purchase! You'll choose shipping, payment method, and review your order.\n\n💡 Students get exclusive discounts! Make sure to apply your student code.",
                    data: null,
                });

            // Product Search
            case 'search_products':
            default:
                let query = {};

                // Price filters
                let priceMatch = message.match(/(under|below|less than|max|upto)\s*pkr?\s*(\d+)/i);
                if (priceMatch && priceMatch[2]) {
                    query.price = { $lt: parseInt(priceMatch[2]) };
                } else {
                    priceMatch = message.match(/(over|above|more than|min|from)\s*pkr?\s*(\d+)/i);
                    if (priceMatch && priceMatch[2]) {
                        query.price = { $gt: parseInt(priceMatch[2]) };
                    }
                }

                // Extract keywords - improved filtering
                let keywords = message
                    .replace(/(under|below|less than|over|above|more than|pkr|rupees|budget)\s*\d+/gi, '')
                    .replace(/(show|me|find|search|for|i|want|need|looking|some|any|get|buy|products|please|give|have)/gi, '')
                    .replace(/[?!.,-]/g, '')
                    .trim();

                if (keywords) {
                    const words = keywords
                        .split(/\s+/)
                        .filter(w => w.length > 2 && !['the', 'and', 'or', 'of', 'to', 'in', 'at', 'is', 'be'].includes(w.toLowerCase()))
                        .slice(0, 5);

                    if (words.length > 0) {
                        const regexes = words.map(w => new RegExp(w, 'i'));
                        query.$or = [
                            { name: { $in: regexes } },
                            { category: { $in: regexes } },
                            { description: { $in: regexes } }
                        ];
                    }
                }

                // Search products
                let products = await Product.find(query)
                    .sort({ ratings: -1 })
                    .limit(6);

                if (products.length > 0) {
                    const resultMsg = products.length === 1 
                        ? `Found **1** perfect match for you:` 
                        : `Found **${products.length}** products matching your search:`;
                    
                    return res.json({
                        type: 'products',
                        message: `🔍 ${resultMsg}\n\nClick on any product to learn more or add to cart!`,
                        data: products.slice(0, 5)
                    });
                } else {
                    // Try broader search
                    if (keywords && keywords.length > 0) {
                        const firstWord = keywords.split(/\s+/)[0];
                        const broaderProducts = await Product.find({
                            $or: [
                                { name: { $regex: firstWord, $options: 'i' } },
                                { category: { $regex: firstWord, $options: 'i' } }
                            ]
                        }).limit(4);

                        if (broaderProducts.length > 0) {
                            return res.json({
                                type: 'products',
                                message: `🔍 Hmm, I didn't find exact matches, but here are similar products:`,
                                data: broaderProducts
                            });
                        }
                    }

                    // AI Fallback response
                    return res.json({
                        type: 'text',
                        message: `😕 I couldn't find products matching "${message.substring(0, 50)}..."\n\n💡 **Try:**\n• Search by category (books, laptops, stationery)\n• Search by price (\"under 5000\")\n• Browse our shop\n\n${getAIFallbackResponse()}`
                    });
                }
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ 
            message: 'Sorry, I encountered an error. Please try again or contact support.' 
        });
    }
};

/**
 * Autocomplete endpoint - product names & common questions
 */
const getAutocomplete = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        const products = await Product.find({
            name: { $regex: q, $options: 'i' }
        }).select('name').limit(8);

        const suggestions = products.map(p => p.name);

        // Add FAQ suggestions
        const faqSuggestions = {
            shipping: ["How much is shipping?", "Shipping info", "Delivery time"],
            track: ["Track my order", "Order status", "Where's my order?"],
            return: ["Return policy", "How to return", "Refund info"],
            pay: ["Payment methods", "Accept credit card?", "COD available?"],
            product: ["Gaming laptops", "Headphones", "Books", "Stationery"],
            recommend: ["What's popular?", "Top rated products", "Bestsellers"],
            help: ["Customer support", "Need help", "Contact us"]
        };

        const qLower = q.toLowerCase();
        for (const [key, faqs] of Object.entries(faqSuggestions)) {
            if (key.includes(qLower) || qLower.includes(key)) {
                suggestions.push(...faqs.slice(0, 2));
                break;
            }
        }

        res.json([...new Set(suggestions)].slice(0, 10));
    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({ message: 'Error fetching suggestions' });
    }
};

/**
 * Product Recommendations Endpoint
 * "Customers also bought" logic
 */
const getRecommendations = async (req, res) => {
    try {
        const { productId, viewedIds } = req.query;
        
        let recommended = [];
        const seenIds = new Set();
        if (productId) seenIds.add(productId);

        // Similar category products
        if (productId) {
            const product = await Product.findById(productId);
            if (product) {
                const similar = await Product.find({ 
                    category: product.category, 
                    _id: { $ne: productId } 
                }).sort({ ratings: -1 }).limit(4);
                
                similar.forEach(p => {
                    recommended.push(p);
                    seenIds.add(p._id.toString());
                });
            }
        }
        
        // Add viewed products recommendations
        if (viewedIds && recommended.length < 4) {
            try {
                const ids = JSON.parse(viewedIds);
                if (Array.isArray(ids) && ids.length > 0) {
                    const history = await Product.find({ 
                        _id: { $in: ids.filter(id => !seenIds.has(id)) } 
                    }).sort({ ratings: -1 }).limit(4 - recommended.length);
                    
                    history.forEach(p => {
                        if (!seenIds.has(p._id.toString())) {
                            recommended.push(p);
                            seenIds.add(p._id.toString());
                        }
                    });
                }
            } catch (e) {
                // Ignore JSON parse errors
            }
        }

        // Fallback to top-rated products
        if (recommended.length < 4) {
            const fallback = await Product.find({ 
                _id: { $nin: Array.from(seenIds) } 
            }).sort({ ratings: -1, numReviews: -1 }).limit(4 - recommended.length);
            
            recommended = recommended.concat(fallback);
        }

        res.json(recommended.slice(0, 4));
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

module.exports = {
    handleChat,
    getAutocomplete,
    getRecommendations
};
