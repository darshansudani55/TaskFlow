const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  No MONGODB_URI found. Starting automatic in-memory MongoDB for local development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log('ℹ️  In-memory MongoDB started successfully!');
      } else {
        throw new Error('MONGODB_URI environment variable is not defined. Please check your .env file.');
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

