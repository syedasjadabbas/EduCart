const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri && process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is not set in production environment.');
    }
    const conn = await mongoose.connect(mongoUri || 'mongodb://localhost:27017/educart');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not exit process in production if we want auto-retry behavior
    if (process.env.NODE_ENV === 'production') {
        console.log('Attempting to reconnect in background...');
    } else {
        process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB Disconnected. Trying to reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB Runtime Error:', err);
});

module.exports = connectDB;
