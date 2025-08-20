import connectDatabase from "../config/connect-database.js";

const ensureDatabaseConnection = async (req, res, next) => {
    try {
        const database = process.env.DATABASE_URI;
        await connectDatabase(database);
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
};

export default ensureDatabaseConnection;
