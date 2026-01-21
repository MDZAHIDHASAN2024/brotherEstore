const mongoose = require('mongoose');
const { mongoDbURL } = require('../secret');

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongoDbURL, options);
    console.log('✅ MongoDB connected successfully');

    mongoose.connection.on('error', (error) => {
      console.error('❌ DB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ Could not connect to MongoDB:', error.message);
    process.exit(1); // অ্যাপ্লিকেশন বন্ধ করে দিন যদি DB connect না হয়
  }
};

module.exports = connectDB;
