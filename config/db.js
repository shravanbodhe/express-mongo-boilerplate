const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const connectDB = async () => {
  const mongoURI = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_LOCAL;


    console.log('$----------------------MongoDB URI - ', mongoURI,' ----------------------$');

  try {
    await mongoose.connect(mongoURI);
    console.log('$----------------------MongoDB Connected ✅ ----------------------$');
  } catch (err) {
    console.error('$---------------------- MongoDB Error ❌ -- ', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;



