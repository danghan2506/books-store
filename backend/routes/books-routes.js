import express from "express";
import { authenticate, authorizedAdmin } from "../middlewares/auth-middleware.js";
import formidable from "express-formidable"
import {addBook,deleteBook,getAllBooks,getBookDetails,updateBook,getNewBooks, getBooks, getTopSalesBooks,getBooksByGenre,getBooksByType} from "../controllers/books-controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router()
router.route("/").post(authenticate, authorizedAdmin,upload.array("image"), addBook)
router.route("/all-books").get(authenticate, getAllBooks)
router.route("/:bookSlug").put(authenticate, authorizedAdmin, updateBook).get(authenticate, getBookDetails)
router.route("/:bookId").delete(authenticate, authorizedAdmin, deleteBook)
router.route("/genres/:genre").get(authenticate, getBooksByGenre)
router.route("/types/:type").get(authenticate, getBooksByType)
router.route("/new-books").get(authenticate, getNewBooks)
router.route("/top-sales").get(authenticate, getTopSalesBooks)

export default router