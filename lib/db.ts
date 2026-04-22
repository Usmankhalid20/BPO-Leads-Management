import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConn ?? { conn: null, promise: null };
global.mongooseConn = cached;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL;
  if (!MONGODB_URI) {
    throw new Error("MongoDB connection string is not defined. Set MONGODB_URI, MONGO_URL, or DATABASE_URL.");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "healthplanlocator" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
