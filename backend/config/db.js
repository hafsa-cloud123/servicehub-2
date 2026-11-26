const mongoose = require('mongoose');

// Connects to MongoDB using the connection string stored in .env (MONGO_URI).
// The URI is a secret, so it is never written directly in the code.
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is missing. Copy .env.example to .env and fill it in.');
  }
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);
};

module.exports = connectDB;
