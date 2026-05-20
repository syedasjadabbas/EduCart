# Database - Data Management & Organization

This folder contains database-related configurations, seeders, migrations, and sample data for EduCart.

## Folder Structure

```
database/
├── config/
│   └── index.js                  # Database configuration index
├── seeders/
│   ├── README.md                 # Seeder documentation
│   └── (implementations in backend/)
├── migrations/
│   ├── README.md                 # Migration documentation
│   └── (migration scripts)
├── samples/
│   ├── sample-data.json          # Sample product/user data
│   └── (other sample files)
└── README.md                     # This file
```

## Components

### 1. Config (`config/`)
Database configuration and connection setup.

**Files:**
- `index.js` - Entry point for database utilities

**Note:** Actual database connection is configured in `backend/config/db.js`

### 2. Seeders (`seeders/`)
Scripts for populating database with initial data.

**Available seeders:**
- `backend/seedAll.js` - Complete database seeding
- `backend/seedStock.js` - Seed product stock

**Run seeders:**
```bash
cd backend
npm run seed
```

### 3. Migrations (`migrations/`)
Database schema updates and data transformations.

**Planned migrations:**
- Add SEO fields to products
- Initialize SEO metadata for existing products

### 4. Samples (`samples/`)
Sample data for testing and documentation.

**Files:**
- `sample-data.json` - Example products and users

## Database Setup

### 1. Connection
MongoDB Atlas connection string in `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/educart?retryWrites=true&w=majority
```

### 2. Initial Setup
```bash
# Install dependencies
cd backend
npm install

# Run seeds
npm run seed

# Start server
npm start
```

### 3. Collections Structure

**Products Collection:**
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
  seoTitle: String,         // Auto-generated
  seoDescription: String,   // Auto-generated
  seoKeywords: [String],    // Auto-generated
  slug: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String,            // 'user', 'admin'
  isVerified: Boolean,
  isStudentVerified: Boolean,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Orders Collection:**
```javascript
{
  _id: ObjectId,
  user: ObjectId,          // Reference to User
  items: [{
    product: ObjectId,     // Reference to Product
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

## Backup & Restore

### Backup MongoDB
```bash
# Using mongodump
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/educart" --out ./backup

# Using MongoDB Atlas Export
# - Go to Atlas > Databases > Collections
# - Click "Export Collection"
```

### Restore MongoDB
```bash
# Using mongorestore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/educart" ./backup
```

## Common Database Tasks

### 1. Add SEO Metadata to Existing Products
```javascript
const Product = require('./models/Product');
const { generateSEOMetadata } = require('../seo-files');

const products = await Product.find({ seoTitle: { $exists: false } });
for (const product of products) {
  const seoData = generateSEOMetadata(product);
  await Product.findByIdAndUpdate(product._id, seoData);
}
```

### 2. Verify Data Integrity
```javascript
// Check for missing required fields
db.products.find({
  $or: [
    { name: { $exists: false } },
    { price: { $exists: false } },
    { stock: { $exists: false } }
  ]
})
```

### 3. Update Category Names
```javascript
db.products.updateMany(
  { category: "old_category" },
  { $set: { category: "new_category" } }
)
```

## Monitoring

### Check Database Size
```bash
# MongoDB Atlas console
Metrics > Disk Usage
```

### Monitor Connections
```bash
# MongoDB Atlas console
Metrics > Connections
```

### View Query Performance
```bash
# MongoDB Atlas console
Performance Advisor
```

## Troubleshooting

### Connection Issues
```bash
# Test connection string
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/educart"
```

### Slow Queries
```javascript
// Check indexes
db.products.getIndexes()

// Create index
db.products.createIndex({ category: 1, price: 1 })
```

### Data Inconsistencies
```bash
# Validate collections
db.validateCollection('products')
```

## Best Practices

1. **Always backup before migrations** - Run seeder tests first
2. **Index frequently searched fields** - Category, price, ratings
3. **Monitor database growth** - Plan scaling early
4. **Use transactions** - For multi-document updates
5. **Archive old data** - Move old orders to archive collection

## Deployment

### MongoDB Atlas Setup
1. Create cluster (M0 Free tier for dev)
2. Create database user with strong password
3. Add IP whitelist (or allow from anywhere for dev)
4. Get connection string
5. Update `.env` with MONGO_URI

### Backup Strategy
- **Dev:** Daily automatic backups (Atlas)
- **Prod:** Hourly automatic backups + manual weekly
- **Retention:** Keep 7 days of backups

## Environment Variables

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/educart
DATABASE_NAME=educart
```

## Useful Commands

```bash
# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/educart"

# List databases
show dbs

# Use database
use educart

# List collections
show collections

# Count documents
db.products.countDocuments()

# Find with filter
db.products.find({ category: "laptops" })

# Aggregation example
db.products.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```

---

**Last Updated:** May 2026
**Version:** 1.0.0
**MongoDB Version:** 6.0+
