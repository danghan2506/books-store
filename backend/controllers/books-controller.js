import asyncHandler from "../middlewares/async-handler.js";
import  Book  from "../models/books-model.js";
import { generateSlug } from "../utils/create-slug.js";
const addBook = asyncHandler(async(req, res) => {
    const {name, author, type, genre, publishingHouse, publishYear, language, description, price, stock} = req.fields
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
        console.log(req.fields)
        const newBook = new Book({...req.fields, slug})
        await newBook.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json(error.message);
    }
})
export {addBook}
