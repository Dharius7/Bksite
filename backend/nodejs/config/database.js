const mongoose = require('mongoose');
const { getMongoUri } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(getMongoUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
