import mongoose from 'mongoose';
import { config } from 'dotenv';
config()
const testConnection = async () => {
    try {
        // Test với URI đơn giản trước
        const uri = "mongodb+srv://danghan1213:danghan.0903@book-store-cluster.fpmmjdf.mongodb.net/book-store";
        console.log("Testing connection to MongoDB Atlas...");
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        
        console.log("✅ Connection successful!");
        console.log("Database name:", mongoose.connection.name);
        console.log("Ready state:", mongoose.connection.readyState);
        
        // Test một query đơn giản
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log("Disconnected successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
        process.exit(1);
    }
};

testConnection();
