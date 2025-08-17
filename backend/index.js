import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./utils/cloudinary.js";
import userRoute from "./routes/users-routes.js"
import bookRoute from "./routes/books-routes.js"
import orderRoute from "./routes/orders-routes.js"
import authRoute from "./routes/auth-routes.js"
import connectDatabase from "./config/connect-database.js";
const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const port = process.env.PORT
const database = process.env.DATABASE_URI
connectDatabase(database)
connectCloudinary()
app.use("/api/users", userRoute)
app.use("/api/books", bookRoute)
app.use("/api/orders", orderRoute)
app.use("/api/auth", authRoute)
app.get("/api/config/paypal", (req, res) => {
    res.send({clientId: process.env.PAYPAL_CLIENT_ID})
})
app.listen(port, (req, res) => {
    console.log(`Server is running on port: ${port}`)
})