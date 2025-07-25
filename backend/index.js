import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./utils/cloudinary.js";
import userRoute from "./routes/users-routes.js"
import bookRoute from "./routes/books-routes.js"
import connectDatabase from "./config/connect-database.js";
const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const port = process.env.port
const database = process.env.DATABASE_URI
connectDatabase(database)
connectCloudinary()
app.use("/api/users", userRoute)
app.use("/api/books", bookRoute)
app.listen(port, (req, res) => {
    console.log(`Server is running on port: ${port}`)
})