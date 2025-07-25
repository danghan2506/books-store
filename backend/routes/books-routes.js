import express from "express";
import { authenticate, authorizedAdmin } from "../middlewares/auth-middleware.js";
import formidable from "express-formidable"
import { addBook } from "../controllers/books-controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router()
router.route("/").post(authenticate, authorizedAdmin,upload.array("image"), addBook)
export default router