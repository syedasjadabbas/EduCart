const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educart');
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
