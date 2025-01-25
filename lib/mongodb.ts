import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

// Ensure `cached` is properly typed
let cached = global.mongoose as { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } | undefined;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached && cached.conn) {
    // Return the cached connection
    return cached.conn;
  }

  if (cached && !cached.promise) {
    // Create a new connection promise without the deprecated options
    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => mongoose);
  }

  if (cached) {
    cached.conn = await cached.promise!;
    return cached.conn;
  }

  throw new Error('Failed to connect to the database');
}

export default dbConnect;