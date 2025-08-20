import connectDatabase from "../config/connect-database.js";

const ensureDatabaseConnection = async (req, res, next) => {
    try {
        const database = process.env.DATABASE_URI;
        if (!database) {
            return res.status(500).json({
                success: false,
                message: "Database configuration missing"
            });
        }
        
        const connection = await connectDatabase(database);
        if (!connection) {
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }
        
        next();
    } catch (error) {
        console.error("Database middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection error"
        });
    }
};

export default ensureDatabaseConnection;
