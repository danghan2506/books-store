import asyncHandler from "../middlewares/async-handler.js";
import  Book  from "../models/books-model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateSlug } from "../utils/create-slug.js";
const addBook = asyncHandler(async(req, res) => {
    const {name, author, type, genre, publishingHouse, publishYear, language, description, price, stock} = req.body
    try {
        switch(true){
            case !name: return res.json("Name is required")
            case !author: return res.json("Author is required")
            case !type: return res.json("Type is required!")
            case !genre: return res.json("Genres is required!")
            case !publishingHouse: return res.json("Publishing house is required!")
            case !publishYear: return res.json("Publish year is required!")
            case !language: return res.json("Langugage is required!")
            case !description: return res.json("Description is required!")
            case !price: return res.json("Price is required!")
            case !stock: return res.json("Stock is required!")
        }
        const slug = generateSlug(name)
        let imageUrls = [];
       if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadRes = await cloudinary.uploader.upload(file.path, {
        folder: "books",
        resource_type: "image",
      });
      imageUrls.push(uploadRes.secure_url);
    }
  } else {
    imageUrls = ["https://via.placeholder.com/150"];
  }
        const newBook = new Book({...req.body, image: imageUrls, slug})
        await newBook.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json(error.message);
    }
})
const removeBook = asyncHandler(async(req, res) => {
    try {
        
    } catch (error) {
        
    }
})
const getAllBooks = asyncHandler(async(req, res) => {
    try {
        
    } catch (error) {
        
    }
})
const getBookBySlug = asyncHandler(async(req, res) => {

})
export {addBook, removeBook, getAllBooks, getBookBySlug}
