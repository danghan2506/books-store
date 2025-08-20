import connectDatabase from "../config/connect-database.js";

const ensureDatabaseConnection = async (req, res, next) => {
    try {
        const database = process.env.DATABASE_URI;
        console.log("Ensuring database connection for:", req.path);
        const connection = await connectDatabase(database);
        if (!connection) {
            console.error("Failed to establish database connection");
            return res.status(500).json({ message: "Database connection failed" });
        }
        console.log("Database connection verified for:", req.path);
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
};

export default ensureDatabaseConnection;
