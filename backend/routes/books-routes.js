import express from "express";
import { authenticate, authorizedAdmin } from "../middlewares/auth-middleware.js";
import formidable from "express-formidable"
import {addBook,deleteBook,getAllBooks,getBookDetails,updateBook,getNewBooks, getBooks, getTopSalesBooks, getBooksByCategory, getAllCategories} from "../controllers/books-controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router()
router.route("/").post(authenticate, authorizedAdmin,upload.array("images"), addBook).get(authenticate, getBooks)
router.route("/all-books").get(authenticate, getAllBooks)
router.route("/all-categories").get(authenticate, getAllCategories)
router.route("/new-books").get(authenticate, getNewBooks)
router.route("/top-sales").get(authenticate, getTopSalesBooks)


router.route("/:id")
.put(authenticate, authorizedAdmin, updateBook)
.get(authenticate, getBookDetails)
.delete(authenticate, authorizedAdmin, deleteBook)

router.route("/:categorySlug").get(authenticate, getBooksByCategory)
export default router