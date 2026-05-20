# 🎓 EduCart - Professional E-Learning Platform

**Advanced online store for students with AI-powered chatbot and professional SEO optimization.**

> A fully-featured e-commerce platform built with React, Node.js, Express, and MongoDB. Now professionally organized with dedicated SEO management and database utilities.

---

## ✨ Key Features

### 🛍️ Shopping Experience
- ✅ **Smart Product Search** - Intelligent filtering by category, price, ratings
- ✅ **Product Details** - Zoom, reviews, recommendations, related products
- ✅ **Smart Cart** - Real-time updates, stock checking, quantity management
- ✅ **Secure Checkout** - Multiple payment methods (COD, Cards, EasyPaisa, JazzCash)
- ✅ **Order Tracking** - Real-time status updates with timestamps

### 🤖 AI & Chatbot
- ✅ **Intelligent Chatbot** - NLP-powered product discovery and support
- ✅ **Natural Language** - Understands greetings, FAQs, recommendations
- ✅ **Product Search** - "Show me gaming laptops under 50000"
- ✅ **Order Tracking** - "Where's my order?" (for logged-in users)
- ✅ **Typing Animation** - Professional UX with smooth interactions

### 🔍 SEO & Search Optimization
- ✅ **Auto-generated Metadata** - SEO titles, descriptions, keywords
- ✅ **Schema.org Markup** - Rich snippets for Google
- ✅ **Social Sharing** - Open Graph & Twitter Card tags
- ✅ **Sitemap Generation** - XML sitemaps for crawlers
- ✅ **Robots.txt** - Search engine directives

### 👥 User Management
- ✅ **Secure Authentication** - JWT-based login system
- ✅ **Student Verification** - Special student discounts
- ✅ **Wishlist** - Save favorite products
- ✅ **Order History** - View all purchases
- ✅ **Profile Management** - Update user info

### ⚙️ Admin Dashboard
- ✅ **Product Management** - Create, edit, delete products
- ✅ **Auto SEO Generation** - Automatic metadata when creating products
- ✅ **Order Management** - View, update, ship orders
- ✅ **User Management** - Manage users and roles
- ✅ **Analytics** - Sales, revenue, user statistics

---

## 📁 Professional Project Structure

The project is now organized professionally with clear separation of concerns:

```
educart/
├── frontend/                    # React/Vite Application
├── backend/                     # Node.js/Express Server
├── seo-files/                   # 🆕 SEO Management Hub
├── database/                    # 🆕 Data Management
├── PROJECT_STRUCTURE.md         # 🆕 Detailed organization guide
└── README.md                    # This file
```

**See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for complete folder breakdown.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Cloudinary account
- Git

### Setup
```bash
# Backend
cd backend
npm install
npm run seed
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Access at http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`.env`)
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/educart
JWT_SECRET=your_super_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Documentation

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete organization guide
- **[seo-files/README.md](./seo-files/README.md)** - SEO utilities
- **[database/README.md](./database/README.md)** - Database management
- **[backend/README.md](./backend/README.md)** - Backend API docs
- **[frontend/README.md](./frontend/README.md)** - Frontend setup

---

## 🎯 AI Chatbot Examples

```
User: "Hi there!"
Bot: "Hey there! 👋 Welcome to EduCart!"

User: "Show me gaming laptops"
Bot: "🔍 Found 5 products matching your search..."

User: "Gaming laptops under 50000"
Bot: "Found gaming laptops under PKR 50,000..."

User: "Where's my order?"
Bot: "📦 Your Recent Orders..."

User: "What's your return policy?"
Bot: "🔄 Return & Refund Policy..."
```

---

## 🔍 SEO Features

- **Auto-generated SEO titles** (60 characters, Google optimized)
- **Smart descriptions** (120-160 characters for search results)
- **Intelligent keywords** (category-specific extraction)
- **Schema.org markup** (Rich snippets in Google)
- **Social media tags** (Open Graph, Twitter Cards)
- **Sitemap generation** (XML for search engines)
- **Robots.txt** (Crawler directives)

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Helmet
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Storage**: Cloudinary CDN
- **Email**: Nodemailer
- **Deployment**: Vercel (frontend), Render (backend)

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Auto-deploys to educart.vercel.app
```

### Backend (Render)
```bash
cd backend
# Render runs: npm start
# Deploys to educart-backend.render.com
```

---

## 🔐 Security

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ HTTPS encryption
✅ CORS protection
✅ Input validation
✅ XSS prevention

---

## 📊 API Endpoints

**Products**
- `GET /api/products` - List products
- `POST /api/products` - Create (admin)
- `PUT /api/products/:id` - Update (admin)

**Users**
- `POST /api/users/register` - Signup
- `POST /api/users/login` - Login

**Orders**
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders

**Chatbot**
- `POST /api/chatbot/query` - Send message
- `GET /api/chatbot/recommendations` - Get recommendations

---

## 🐛 Troubleshooting

**MongoDB connection error?**
- Verify MONGO_URI in .env
- Check IP whitelist in MongoDB Atlas

**Chatbot not responding?**
- Ensure backend is running on port 5000
- Check API URL in frontend .env

**SEO not showing?**
- Clear browser cache
- Check DevTools → Elements

---

## 📄 License

MIT License - see LICENSE file

---

## 👨‍💻 Author

EduCart Development Team - Professional e-commerce platform

---

## 📊 Project Stats

- **Frontend**: React + Vite + Tailwind
- **Backend**: Node.js + Express + MongoDB
- **Components**: 50+
- **API Endpoints**: 30+
- **Production Ready**: ✅ Yes

---

**Last Updated:** May 2026 | Status: ✅ Production Ready | Version: 1.0.0
