/**
 * MongoDB Connection Config
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8 defaults are good, no need for deprecated options
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
