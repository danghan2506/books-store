import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./utils/cloudinary.js";
import userRoute from "./routes/users-routes.js";
import bookRoute from "./routes/books-routes.js";
import orderRoute from "./routes/orders-routes.js";
import authRoute from "./routes/auth-routes.js";
import connectDatabase from "./config/connect-database.js";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler.js";
import ensureDatabaseConnection from "./middlewares/database-middleware.js";
const app = express();
config()
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const database = process.env.DATABASE_URI;
const port = process.env.PORT || 5000;

// Connect to cloudinary
connectCloudinary();

// Ensure database connection for all API routes
app.use("/api/users", ensureDatabaseConnection, userRoute);
app.use("/api/books", ensureDatabaseConnection, bookRoute);
app.use("/api/orders", ensureDatabaseConnection, orderRoute);
app.use("/api/auth", ensureDatabaseConnection, authRoute);
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// Error handler middleware must be last
app.use(errorHandler);

// Export app for Vercel
export default app;

// Start server only in development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
