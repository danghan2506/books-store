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
import { apiLimiter } from "./middlewares/rate-limiter.js";
const app = express();
config();
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,         // domain production
        "http://localhost:5173"           // local dev
      ];
      // Cho phép request không có origin (ví dụ: Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const database = process.env.DATABASE_URI;
const port = process.env.PORT || 5000;

// Connect to cloudinary
connectCloudinary();

// Ensure database connection for all API routes
app.use("/api/users", apiLimiter, ensureDatabaseConnection, userRoute);
app.use("/api/books", apiLimiter,  ensureDatabaseConnection, bookRoute);
app.use("/api/orders", apiLimiter,  ensureDatabaseConnection, orderRoute);
app.use("/api/auth",apiLimiter, ensureDatabaseConnection, authRoute);
app.get("/api/config/paypal", apiLimiter, (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});
// Error handler middleware must be last
app.use(errorHandler);

// Export app for Vercel
export default app;

app.listen(port, () => console.log(`Server running on port ${port}`));
