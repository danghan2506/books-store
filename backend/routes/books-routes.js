import express from "express";
import { authenticate, authorizedAdmin } from "../middlewares/auth-middleware.js";
import formidable from "express-formidable"
import { addBook } from "../controllers/books-controller.js";
const router = express.Router()
router.route("/").post(authenticate, authorizedAdmin,formidable(),  addBook)
export default router