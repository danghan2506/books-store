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

app.use(cors({
  origin: "https://bstore-frontend.vercel.app", // ví dụ: "https://book-store.vercel.app"
  credentials: true
}));
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
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
export const handler = serverless(app);
