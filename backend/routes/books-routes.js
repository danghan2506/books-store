import express from "express";
import { authenticate, authorizedAdmin } from "../middlewares/auth-middleware.js";
import formidable from "express-formidable"
import {addBook,deleteBook,getAllBooks,getBookDetails,updateBook,getNewBooks, getBooks, getTopSalesBooks, getBooksByCategory, getAllCategories} from "../controllers/books-controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router()
router.route("/").post(authenticate, authorizedAdmin,upload.array("images"), addBook).get(getBooks)
router.route("/all-books").get(authenticate, getAllBooks)
router.route("/all-categories").get(authenticate, getAllCategories)
router.route("/category/:categorySlug").get(authenticate, getBooksByCategory)
router.route("/new-books").get(authenticate, getNewBooks)
router.route("/top-sales").get(authenticate, getTopSalesBooks)
router.route("/:bookSlug").put(authenticate, authorizedAdmin, updateBook).get(authenticate, getBookDetails)
router.route("/:bookId").delete(authenticate, authorizedAdmin, deleteBook)
export default router