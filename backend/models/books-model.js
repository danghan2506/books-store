import mongoose from "mongoose";
const reviewsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, required: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, required: true },
    genres: [{ name: String, slug: String }],
    publishingHouse: { type: String, required: true },
    publishYear: {
      type: Number,
      required: true,
      min: 1000,
      max: new Date().getFullYear(),
    },
    language: { type: String, required: true },
    pageNumber: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    salesCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Price must be positive",
      },
    },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    reviews: [reviewsSchema],
  },
  { timestamps: true }
);
const Book = new mongoose.model("Book", bookSchema);
