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
        
        // Check if already connected
        if (cached.conn && mongoose.connection.readyState === 1) {
            console.log("Using existing database connection");
            return cached.conn;
        }
        
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 2,
                maxIdleTimeMS: 30000,
                connectTimeoutMS: 15000,
                retryWrites: true,
                w: 'majority'
            };
            
            console.log("Creating new database connection...");
            cached.promise = mongoose.connect(DATABASE_URI, opts).then((mongoose) => {
                console.log("MongoDB connection established successfully");
                return mongoose;
            }).catch((error) => {
                console.error("MongoDB connection failed:", error);
                cached.conn = null;
                cached.promise = null;
                throw error;
            });
        }
        
        cached.conn = await cached.promise;
        console.log("Database connection ready, state:", mongoose.connection.readyState);
        return cached.conn;
    } catch (error) {
        console.error("Failed to connect to database:", error?.message || error);
        cached.conn = null;
        cached.promise = null;
        throw error;
    }
}
export default connectDatabase