import mongoose from "mongoose";

let cached = global.mongooseConnectionCache;
if (!cached) {
    cached = global.mongooseConnectionCache = { conn: null, promise: null };
}

const connectDatabase = async (DATABASE_URI) => {
    try {
        if (!DATABASE_URI) {
            console.error("DATABASE_URI is missing. Set it in your environment variables.");
            throw new Error("DATABASE_URI is missing");
        }
        
        if (cached.conn) {
            console.log("Using cached database connection");
            return cached.conn;
        }
        
        if (!cached.promise) {
            console.log("Creating new database connection...");
            const opts = {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 5
            };
            cached.promise = mongoose.connect(DATABASE_URI, opts);
        }
        
        cached.conn = await cached.promise;
        console.log("Connect to database successfully!");
        return cached.conn;
    } catch (error) {
        console.error("Failed to connect to database:", error?.message || error);
        cached.conn = null;
        cached.promise = null;
        throw error;
    }
}
export default connectDatabase