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
import { errorHandler } from "./middlewares/error-handler.js";
const app = express()
dotenv.config()
// CORS configuration
const allowedOriginsFromEnv = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = allowedOriginsFromEnv.length
  ? allowedOriginsFromEnv
  : [
      'http://localhost:5173',
      'http://localhost:5000',
      'https://bstore-frontend.vercel.app',
      'https://www.sandbox.paypal.com',
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin);
    return callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
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
// Error handler should be last
app.use(errorHandler)

// Start server only when running locally (not in serverless env like Vercel)
if (process.env.VERCEL !== '1') {
    app.listen(port, (req, res) => {
        console.log(`Server is running on port ${port}`);
    })
}
export default app