# EduCart - Project Structure & Organization

Professional organization of the EduCart project for maintainability and scalability.

**Last Updated:** May 2026
**Status:** Production Ready ✅

---

## 📁 Project Structure

```
educart/
│
├── frontend/                           # React/Vite Frontend Application
│   ├── src/
│   │   ├── components/                 # Reusable React components
│   │   ├── pages/                      # Page components
│   │   ├── context/                    # Context API providers
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── utils/                      # Utility functions
│   │   ├── assets/                     # Images, icons, files
│   │   ├── App.jsx                     # Main app component
│   │   └── main.jsx                    # Entry point
│   ├── public/                         # Static files & robots.txt
│   ├── vite.config.js                  # Vite configuration
│   ├── package.json                    # Frontend dependencies
│   └── README.md                       # Frontend documentation
│
├── backend/                            # Node.js/Express Backend
│   ├── config/                         # Configuration files
│   │   └── db.js                       # MongoDB connection
│   ├── controllers/                    # Request handlers
│   │   ├── chatbotController.js        # AI Chatbot logic
│   │   ├── productController.js        # Product operations
│   │   ├── userController.js           # User management
│   │   ├── orderController.js          # Order processing
│   │   └── ...
│   ├── models/                         # MongoDB schemas
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── ...
│   ├── routes/                         # API endpoints
│   │   ├── productRoutes.js            # /api/products
│   │   ├── userRoutes.js               # /api/users
│   │   ├── chatbotRoutes.js            # /api/chatbot
│   │   └── ...
│   ├── middleware/                     # Express middleware
│   │   ├── authMiddleware.js           # JWT authentication
│   │   └── upload.js                   # File uploads
│   ├── utils/                          # Utility functions
│   │   ├── sendEmail.js                # Email service
│   │   ├── generateToken.js            # JWT tokens
│   │   └── seoGenerator.js             # (Wrapper to seo-files/)
│   ├── uploads/                        # Uploaded files
│   ├── server.js                       # Express server setup
│   ├── package.json                    # Backend dependencies
│   ├── .env                            # Environment variables
│   └── README.md                       # Backend documentation
│
├── seo-files/                          # 🆕 SEO Management & Utilities
│   ├── generators/
│   │   └── seoGenerator.js             # Core SEO metadata generation
│   ├── markup/
│   │   ├── schemaGenerator.js          # JSON-LD Schema.org
│   │   └── socialMetaTags.js           # Open Graph & Twitter Cards
│   ├── utilities/
│   │   └── sitemapGenerator.js         # XML Sitemap generation
│   ├── robots.txt                      # Search engine directives
│   ├── index.js                        # Central entry point
│   └── README.md                       # SEO documentation
│
├── database/                           # 🆕 Data Management
│   ├── config/
│   │   └── index.js                    # Database configuration
│   ├── seeders/
│   │   └── README.md                   # Seeding documentation
│   ├── migrations/
│   │   └── README.md                   # Migration scripts
│   ├── samples/
│   │   └── sample-data.json            # Example data
│   └── README.md                       # Database documentation
│
├── README.md                           # Main documentation
├── start_educart.bat                   # Start script
├── package.json                        # Root package (optional)
└── .gitignore                          # Git ignore rules
```

---

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs on: `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install
npm start
```
Runs on: `http://localhost:5000`

### Full Stack (Batch File)
```bash
./start_educart.bat
```

---

## 📦 Major Folders Explained

### `/frontend` - React Application
**What:** Complete React/Vite frontend application
**Contains:**
- UI Components (Navbar, Footer, Chatbot, etc.)
- Pages (Home, Product, Cart, Checkout, etc.)
- State management (Context API)
- Utilities (API calls, formatters, helpers)
- Styling and assets

**Tech Stack:**
- React 18+
- Vite
- Tailwind CSS
- React Router
- React Helmet (for SEO meta tags)

**Key Features:**
- Component-based architecture
- Dark/Light theme support
- Responsive design
- SEO-optimized pages
- Real-time cart management

---

### `/backend` - Express Server
**What:** Node.js/Express REST API server
**Contains:**
- API Routes (/api/products, /api/users, /api/chatbot, etc.)
- Request Handlers (Controllers)
- Database Models (MongoDB schemas)
- Authentication & Authorization
- File uploads (via Cloudinary)
- Email notifications

**Tech Stack:**
- Node.js 16+
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

**Key Features:**
- RESTful API design
- JWT-based authentication
- Role-based access control (Admin/User)
- Cloudinary file uploads
- Error handling middleware
- Request validation

---

### `/seo-files` - 🆕 SEO Management
**What:** Centralized SEO utilities and configurations
**Contains:**
- SEO Metadata Generators
- Schema.org Markup (JSON-LD)
- Social Media Tags (Open Graph, Twitter)
- Sitemap Generation
- Robots.txt rules

**Key Features:**
- Auto-generated SEO titles & descriptions
- Intelligent keyword extraction
- Structured data for search engines
- Social media rich previews
- Search engine crawler directives

**Usage:**
```javascript
const { generateSEOMetadata } = require('../seo-files');
const seoData = generateSEOMetadata(product);
```

---

### `/database` - 🆕 Data Organization
**What:** Database configuration, migrations, and sample data
**Contains:**
- Database connection setup
- Seeder scripts
- Migration utilities
- Sample data for testing

**Key Features:**
- Organized data management
- Easy data initialization
- Migration tracking
- Sample data templates

---

## 🔗 Key Integrations

### Frontend → Backend Communication
```javascript
// Example: Fetch products
fetch('/api/products')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Backend → Database
```javascript
// MongoDB connection via config/db.js
const db = require('./config/db');
const Product = require('./models/Product');
const products = await Product.find();
```

### Backend → SEO Management
```javascript
// Auto-generates SEO when creating product
const { generateSEOMetadata } = require('../../seo-files');
const seoData = generateSEOMetadata(productData);
```

### Frontend → SEO Integration
```javascript
// React Helmet sets meta tags
import { Helmet } from 'react-helmet-async';
<Helmet>
  <title>{product.seoTitle}</title>
  <meta name="description" content={product.seoDescription} />
</Helmet>
```

---

## 📂 File Organization Benefits

### Before (Flat)
```
educart/
├── All backend files mixed
├── No SEO separation
├── Database files scattered
└── Hard to navigate
```

### After (Organized)
```
educart/
├── frontend/          (Clean separation)
├── backend/           (Organized APIs)
├── seo-files/         (Centralized SEO)
├── database/          (Data management)
└── Clear structure
```

**Benefits:**
✅ Better code organization
✅ Easier to find files
✅ Scalable for team growth
✅ Clear separation of concerns
✅ Easier onboarding
✅ Professional structure

---

## 🔄 Workflow Examples

### Creating a New Product
1. **Frontend:** User submits product form
2. **Backend:** POST `/api/products` endpoint
3. **SEO:** `generateSEOMetadata()` auto-runs
4. **Database:** Product + SEO data saved to MongoDB
5. **Frontend:** Product appears with SEO tags

### Product Page Loading
1. **Frontend:** Renders ProductDetails page
2. **Backend:** Fetches product from MongoDB
3. **SEO:** React Helmet sets meta tags
4. **Frontend:** Social tags ready for sharing
5. **Search Engines:** Crawl with rich data

### Chatbot Query
1. **Frontend:** User sends message
2. **Backend:** Routes to chatbotController
3. **AI:** NLP intent detection
4. **Database:** Product search if needed
5. **Frontend:** Displays results with products

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Vercel auto-detects Vite config
npm run build
# Deploys to: educart.vercel.app
```

### Backend (Render)
```bash
# Render runs: npm start
# Deploys to: educart-backend.render.com
```

### Environment Variables

**Frontend (`frontend/.env`):**
```
VITE_API_URL=https://educart-backend.render.com/api
```

**Backend (`backend/.env`):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/educart
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
SMTP_USER=your_email@gmail.com
```

---

## 🔒 Security

### Authentication Flow
```
User Login → JWT Generated → Token in Header → Routes Protected
```

### Admin Access
```
Only admins can:
- Create/Edit/Delete products
- Manage users
- View orders
- Access admin dashboard
```

### File Uploads
```
Local files → Cloudinary CDN → Global distribution
```

---

## 📊 Database Design

### Collections
1. **Products** - 2000+ products
2. **Users** - Student & admin accounts
3. **Orders** - Purchase history
4. **Reviews** - Product ratings
5. **Wishlist** - Saved items
6. **Newsletter** - Email subscribers
7. **Coupons** - Discount codes

### Indexing
```javascript
// Performance optimization
db.products.createIndex({ category: 1, price: 1 })
db.orders.createIndex({ user: 1, createdAt: -1 })
```

---

## 🐛 Troubleshooting

### Port Issues
```bash
# Backend won't start on port 5000?
# Check if port is in use, then change in server.js
```

### CORS Errors
```javascript
// Update backend/server.js
app.use(cors({
  origin: 'http://localhost:5173'
}))
```

### MongoDB Connection
```bash
# Check .env MONGO_URI is correct
# Verify IP whitelist in MongoDB Atlas
```

### SEO Not Working
```javascript
// Clear browser cache
// Check React Helmet is installed
// Verify meta tags in browser DevTools
```

---

## 📚 Documentation

Each folder has its own README:
- `frontend/README.md` - Frontend setup & structure
- `backend/README.md` - Backend API documentation
- `seo-files/README.md` - SEO utilities guide
- `database/README.md` - Database management

---

## 👥 Team Guidelines

### Frontend Development
- Components in `src/components/`
- Pages in `src/pages/`
- Styles using Tailwind
- Test in `npm run dev`

### Backend Development
- Routes in `backend/routes/`
- Logic in `backend/controllers/`
- Models in `backend/models/`
- Test with Postman/API client

### Adding Features
1. Plan in backend first
2. Implement API endpoint
3. Add frontend component
4. Update SEO if needed
5. Test thoroughly
6. Deploy to Vercel/Render

---

## 🎯 Production Checklist

- ✅ All APIs tested
- ✅ SEO metadata generated
- ✅ Authentication working
- ✅ File uploads functional
- ✅ Database indexed
- ✅ Environment variables set
- ✅ Error handling in place
- ✅ Performance optimized

---

## 📞 Support

### Common Issues
- **404 errors:** Check routes in backend/routes/
- **Database errors:** Verify MONGO_URI in .env
- **CORS errors:** Update cors() in server.js
- **Auth errors:** Check JWT_SECRET in .env

### Quick Fixes
```bash
# Clear node_modules
rm -r node_modules package-lock.json
npm install

# Restart services
npm start (backend)
npm run dev (frontend)
```

---

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor database size
- Review server logs
- Check SEO performance
- Update dependencies monthly
- Test payment integration

### Quarterly Reviews
- Performance optimization
- Security audit
- User feedback implementation
- Feature planning

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** ✅ Production Ready  
**Maintained by:** EduCart Development Team
