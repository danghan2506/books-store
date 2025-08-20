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
const app = express();
config()
app.use(cors())
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
// Export app for Vercel
export default app;

// Start server only in development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
