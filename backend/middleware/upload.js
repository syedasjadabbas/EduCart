const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Standard local configuration (as fallback)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const localDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'txn-' + unique + path.extname(file.originalname));
    },
});

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
    // Cloudinary configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'educart_uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
            public_id: (req, file) => {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                return 'txn-' + unique;
            }
        }
    });

    console.log('--- IMAGES: Cloudinary Storage Enabled ---');
} else {
    // Fallback to local disk
    storage = localDiskStorage;
    console.warn('--- IMAGES: Using Local Storage (Images will be lost on server restart!) ---');
}

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
