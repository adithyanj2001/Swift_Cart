const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('MONGO_URI from env:', process.env.MONGO_URI); 
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
