import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const port = process.env.port
const database = process.env.DATABASE_URI
app.listen(port, (req, res) => {
    console.log(`Server is running on port: ${port}`)
})