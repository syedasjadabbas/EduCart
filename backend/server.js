const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://edu-cart-ten.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Request logger & URL Sanitizer
app.use((req, res, next) => {
    // Squeeze multiple slashes into one (e.g. //api -> /api)
    if (req.url.includes('//')) {
        req.url = req.url.replace(/\/+/g, '/');
    }
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Serve uploaded screenshots
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const couponRoutes = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID || 'sb'));

app.get('/', (req, res) => {
    res.send('EduCart API is running...');
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[ERROR] ${err.message}`);
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
    console.warn('[WARNING] JWT_SECRET is not defined. Using fallback_secret (insecure for production).');
}

if (!process.env.MONGO_URI) {
    console.warn('[WARNING] MONGO_URI is not defined. Connecting to local MongoDB.');
}

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
