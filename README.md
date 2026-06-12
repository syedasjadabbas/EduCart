# EduCart – Full-Stack E-Commerce Platform

![EduCart Banner](https://img.shields.io/badge/EduCart-Full%20Stack%20E--Commerce-blueviolet?style=for-the-badge&logo=react&logoColor=white)

**🎓 Production-oriented full-stack e-commerce platform** built with React.js, Node.js, Express, and MongoDB featuring scalable backend architecture, JWT authentication, AI-powered chatbot support, and SEO optimization.

---

## 🚀 Overview

EduCart is a modern e-commerce platform designed for students and online shoppers with a focus on scalability, modular backend architecture, responsive UI, and production-ready workflows.

The platform includes secure authentication, intelligent product search, order management, AI chatbot assistance, SEO optimization, and an admin dashboard for managing products, users, and orders.

## 🌐 Live Demo

- **Frontend:** [https://edu-cart-ten.vercel.app/](https://edu-cart-ten.vercel.app/)
- **Backend API:** [https://educart-backend-ucw2.onrender.com](https://educart-backend-ucw2.onrender.com)

---

## ✨ Features

### 🛒 E-Commerce System

- Product catalogue and category filtering
- Smart product search and recommendations
- Cart and checkout workflows
- Wishlist functionality
- Order tracking and purchase history
- Student-focused shopping experience

### 🔐 Authentication & Security

- JWT-based authentication
- Protected routes and role-based access
- Password hashing using bcryptjs
- Secure API workflows
- Input validation and error handling

### 🤖 AI Chatbot

- NLP-powered customer support chatbot
- Product recommendation system
- Natural language product queries
- Order tracking assistance
- FAQ and support automation

### 📊 Admin Dashboard

- Product management
- User and order management
- Sales analytics overview
- Inventory workflows
- SEO metadata management

### 🔍 SEO Optimization

- Dynamic SEO metadata generation
- Schema.org structured data
- Open Graph and Twitter Cards
- XML sitemap generation
- Robots.txt optimization

### 🏗️ Engineering Highlights

- Modular frontend/backend separation
- REST API-driven architecture
- JWT-based authentication workflows
- Optimized database operations
- SEO-focused rendering system
- Scalable project organization

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Helmet** - SEO management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Authentication & Security
- **JWT** - Token-based auth
- **bcryptjs** - Password hashing

### Tools & Services
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Git & GitHub** - Version control
- **Postman** - API testing

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

---

## 🏛️ Architecture

```
┌─────────────────────────────────────┐
│     React Frontend (Vite)           │
│  - Components                       │
│  - State Management                 │
│  - UI/UX                            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     REST API Layer                  │
│  - HTTP Endpoints                   │
│  - Request/Response                 │
│  - CORS Policy                      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Express Backend                   │
│  - Controllers                      │
│  - Middleware                       │
│  - Business Logic                   │
│  - JWT Authentication               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   MongoDB Database                  │
│  - Collections                      │
│  - Indexes                          │
│  - Aggregations                     │
└─────────────────────────────────────┘
```

---

## 🏃 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account (for image storage)

### Clone Repository

```bash
git clone https://github.com/syedasjadabbas/EduCart.git
cd EduCart
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
SMTP_USER=your_email
SMTP_PASS=your_password
PORT=5000
```

Start server:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 📦 Project Structure

```
EduCart/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # State management
│   │   ├── utils/              # Helper functions
│   │   └── assets/             # Images & icons
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Express + Node.js
│   ├── config/                 # Configuration
│   ├── controllers/            # Request handlers
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Custom middleware
│   ├── utils/                  # Utilities
│   ├── uploads/                # Uploaded files
│   ├── server.js               # Entry point
│   └── package.json
│
├── seo-files/                  # SEO Management
│   ├── generators/             # SEO generation
│   ├── markup/                 # Schema.org markup
│   ├── utilities/              # Utilities
│   ├── robots.txt              # Robot directives
│   └── index.js                # Entry point
│
├── database/                   # Database Management
│   ├── config/                 # DB config
│   ├── seeders/                # Data seeders
│   ├── migrations/             # DB migrations
│   └── samples/                # Sample data
│
└── README.md                   # Documentation
```

---

## 🎨 Components

### Banner Component
The homepage features a professional, animated banner showcasing:
- Gradient animated background
- EduCart branding
- Tech stack display
- Interactive mockups (Admin Dashboard, Products, Architecture, Cart)
- Call-to-action button

Located at: `frontend/src/components/Banner/Banner.jsx`

---

## 🗄️ Database Collections

### Products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  ratings: Number,
  numReviews: Number,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  slug: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String,           // 'user', 'admin'
  isVerified: Boolean,
  isStudentVerified: Boolean,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
```javascript
{
  _id: ObjectId,
  user: ObjectId,         // Reference to User
  items: [{
    product: ObjectId,    // Reference to Product
    qty: Number,
    price: Number
  }],
  totalPrice: Number,
  shippingAddress: Object,
  isShipped: Boolean,
  isDelivered: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/history` - Get chat history

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Deploy automatically

### Backend (Render)
1. Connect GitHub repo to Render
2. Set environment variables
3. Deploy on push

### Database (MongoDB Atlas)
1. Create M0 cluster
2. Create database user
3. Get connection string
4. Update backend `.env`

---

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Database Documentation](./database/README.md)
- [SEO Files Documentation](./seo-files/README.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

---

## 🔄 Environment Variables

```env
# Backend
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/educart
JWT_SECRET=your_secret_key
PORT=5000

# Cloudinary
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret

# Email
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/educart"
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
- Check backend CORS configuration
- Verify frontend URL in backend `.env`

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**SYED ASJAD ABBAS**

- GitHub: [@syedasjadabbas](https://github.com/syedasjadabbas)
- Email: asjadabbaszaidi@gmail.com

---

## 🙏 Acknowledgments

- React & Vite communities
- MongoDB documentation
- Express.js guides
- Open source contributors

---

## 📊 Stats

- **Language:** JavaScript (99.3%)
- **Total Commits:** Active development
- **Last Updated:** June 2026
- **Status:** ✅ Production Ready

---

<p align="center">
  Made with ❤️ by Syed Asjad Abbas
  <br />
  <a href="https://github.com/syedasjadabbas/EduCart">⭐ Star us on GitHub</a>
</p>
