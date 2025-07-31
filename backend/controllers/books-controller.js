import asyncHandler from "../middlewares/async-handler.js";
import Book from "../models/books-model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateSlug } from "../utils/create-slug.js";
const addBook = asyncHandler(async (req, res) => {
  const {
    name,
    author,
    category, 
    publishingHouse,
    publishYear,
    language,
    description,
    price,
    stock,
    pageNumber,
  } = req.body;
  try {
    switch (true) {
      case !name:
        return res.json("Name is required");
      case !author:
        return res.json("Author is required");
      case !category: return res.json("Cateogy is required!")
      case !publishingHouse:
        return res.json("Publishing house is required!");
      case !publishYear:
        return res.json("Publish year is required!");
      case !language:
        return res.json("Langugage is required!");
      case !description:
        return res.json("Description is required!");
      case !price:
        return res.json("Price is required!");
      case !stock:
        return res.json("Stock is required!");
      case !pageNumber:
        return res.json("Page number is required!");
    }
    const slug = generateSlug(name);
    const categorySlug = generateSlug(category)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: "books",
          resource_type: "image",
        });
        imageUrls.push({
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
    });
      }
    } else {
       imageUrls = [
    {
      url: "https://via.placeholder.com/150",
      public_id: "placeholder", // hoặc null nếu bạn muốn
    },
  ];
    }
    const newBook = new Book({
      name,
      slug,
      author,
      category: {categoryName: category, categorySlug: categorySlug},
      publishingHouse,
      publishYear,
      language,
      description,
      price,
      stock,
      images: imageUrls,
      pageNumber: pageNumber,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
const updateBook = asyncHandler(async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      res.status(404).json("No book found!");
    } else {
      book.name = req.body.name || book.name;
      book.author = req.body.author || book.author;
      book.category = {
        categoryName: req.body.category,
        categorySlugSlug: generateSlug(req.body.category),
      };
      book.publishingHouse = req.body.publishingHouse || book.publishingHouse;
      book.publishYear = req.body.publishYear || book.publishYear;
      book.language = req.body.language || book.language;
      book.pageNumber = req.body.pageNumber || book.pageNumber;
      book.description = req.body.description || book.description;
      book.price = req.body.price || book.price;
      book.stock = req.body.stock || book.stock;
      const updateBook = await book.save();
      res.json(updateBook);
    }
  } catch (error) {
    console.log(error);
  }
});
const deleteBook = asyncHandler(async (req, res) => {
  const {bookId} = req.params
  try {
    const book = await Book.findById(bookId)
    if(!book){
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.image && book.image.length > 0) {
  for (const img of book.image) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }
}
    const deletedBook = await Book.findByIdAndDelete(bookId)
    res.json({
      message: "Book and associated images deleted successfully",
      deletedBook,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error while deleting book" });
  }
});
const getBookDetails = asyncHandler(async (req, res) => {
  const { bookSlug } = req.params;
  const bookDetails = await Book.findOne({ slug: bookSlug });
  if (!bookDetails) {
    throw new Error("Book not found!");
  } else {
    res.json(bookDetails);
  }
});
const getAllBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.log(error);
  }
});
const getBooks = asyncHandler(async (req, res) => {
  try {
    const pageSize = 10;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Book.countDocuments({ ...keyword });
    const books = await Book.find({ ...keyword }).limit(pageSize);
    res.json({
      books,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const getNewBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 }).limit(12);
    res.json(books);
  } catch (error) {
    console.log(error);
  }
});
const getTopSalesBooks = asyncHandler(async (req, res) => {
  try {
    const topSalesBooks = await Book.find({})
      .sort({ salesCount: -1 })
      .limit(12);
    res.json(topSalesBooks);
  } catch (error) {
    console.log(error);
  }
});
const getBooksByCategory = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;
  const books = await Book.find({
    "category.categorySlug": { $regex: `^${categorySlug}$`, $options: "i" },
  });
  if (books.length === 0) {
    return res
      .status(404)
      .json({ message: `No books found for genre: ${categorySlug}` });
  }
  res.json(books);
});
const getAllCategories = asyncHandler(async(req, res) => {
  const books = await Book.find({}, "category.categoryName");
  const categoryNames = books.map(book => book.category?.categoryName).filter(Boolean);

  // Remove duplicates using Set
  const uniqueCategories = [...new Set(categoryNames)];

  res.json(uniqueCategories);

})

export {addBook,deleteBook,getAllBooks,getBookDetails,updateBook,getNewBooks, getBooks, getTopSalesBooks, getBooksByCategory, getAllCategories};
