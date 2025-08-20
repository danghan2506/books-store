import mongoose from "mongoose";

let cached = global.mongooseConnectionCache;
if (!cached) {
    cached = global.mongooseConnectionCache = { conn: null, promise: null };
}

const connectDatabase = async (DATABASE_URI) => {
    try {
        if (!DATABASE_URI) {
            console.error("DATABASE_URI is missing. Set it in your environment variables.");
            return null;
        }
        if (cached.conn) {
            return cached.conn;
        }
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 2,
                maxIdleTimeMS: 30000,
                connectTimeoutMS: 10000,
                retryWrites: true,
                w: 'majority'
            };
            cached.promise = mongoose.connect(DATABASE_URI, opts).then((mongoose) => {
                console.log("MongoDB connection established");
                return mongoose;
            });
        }
        cached.conn = await cached.promise;
        console.log("Connect to database successfully!");
        return cached.conn;
    } catch (error) {
        console.error("Failed to connect to database:", error?.message || error);
        cached.conn = null;
        cached.promise = null;
        return null;
    }
}
export default connectDatabase