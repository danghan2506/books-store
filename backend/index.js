import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./utils/cloudinary.js";
import userRoute from "./routes/users-routes.js";
import bookRoute from "./routes/books-routes.js";
import orderRoute from "./routes/orders-routes.js";
import authRoute from "./routes/auth-routes.js";
import connectDatabase from "./config/connect-database.js";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler.js";
import serverless from "serverless-http";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "..", ".env") });
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN,
    "https://www.sandbox.paypal.com",
  ]
    , // ví dụ: "https://book-store.vercel.app"
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: true,
  optionsSuccessStatus: 204
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
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
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
app.use(errorHandler)
export default app;
