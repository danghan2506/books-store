import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./utils/cloudinary.js";
import userRoute from "./routes/users-routes.js";
import bookRoute from "./routes/books-routes.js";
import orderRoute from "./routes/orders-routes.js";
import authRoute from "./routes/auth-routes.js";
import connectDatabase from "./config/connect-database.js";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler.js";
const app = express();
dotenv.config();
// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev server
    "http://localhost:3000", // React/Next.js backup
    "http://127.0.0.1:5173", // Alternative localhost
    "https://bstore-frontend.vercel.app", // Remove trailing slash
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // Nếu dùng cookies/auth
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const database = process.env.DATABASE_URI;
connectDatabase(database);
connectCloudinary();
const port = process.env.PORT || 5000;
app.use("/api/users", userRoute);
app.use("/api/books", bookRoute);
app.use("/api/orders", orderRoute);
app.use("/api/auth", authRoute);
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});
// Error handler should be last
app.use(errorHandler);
app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});

export default app;
