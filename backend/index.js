import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./utils/cloudinary.js";
import userRoute from "./routes/users-routes.js"
import bookRoute from "./routes/books-routes.js"
import orderRoute from "./routes/orders-routes.js"
import authRoute from "./routes/auth-routes.js"
import connectDatabase from "./config/connect-database.js";
import cors from 'cors';
const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Local dev
    'http://localhost:5173',           // Vite dev server
    'https://bstore-frontend.vercel.app', // Production frontend
  ],
  credentials: true,                   // Cho phép cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));
const database = process.env.DATABASE_URI
connectDatabase(database)
connectCloudinary()
const port = process.env.PORT || 5000
app.use("/api/users", userRoute)
app.use("/api/books", bookRoute)
app.use("/api/orders", orderRoute)
app.use("/api/auth", authRoute)

app.get("/api/config/paypal", (req, res) => {
    res.send({clientId: process.env.PAYPAL_CLIENT_ID})
})
app.get("/", (req, res) => {
    res.json({ message: "API is running!" });
});
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
})
export default app