import { useCallback, useState } from "react"
import { useCreateBookMutation } from "@/redux/API/book-api-slice"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/comp-549";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  BookPlus,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const BooksForm = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("")
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [publishingHouse, setPublishingHouse] = useState("");
  const [publishYear, setPublishYear] = useState("")
  const [language, setLanguage] = useState("")
  const [pageNumber, setPageNumber] = useState("")
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<File[]>([])
  const navigate = useNavigate();
  const [createBook, { isLoading }] = useCreateBookMutation();
  const onFilesChange = useCallback((files: File[]) => {
    setImages(files)
  }, [])
  const handleSubmit = useCallback(async () => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("author", author)
      formData.append("category", category)
      formData.append("publishingHouse", publishingHouse)
      formData.append("publishYear", publishYear)
      formData.append("language", language)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("stock", stock)
      formData.append("pageNumber", pageNumber)
      images.forEach((file) => formData.append("images", file))
      const res = await createBook(formData).unwrap()
      console.log(res)
      toast.success("Created book successfully")
      navigate("/admin/books-list", { replace: true })
    } catch (err: unknown) {
      console.error(err)
      let message = "Failed to create book"
      if (typeof err === "object" && err !== null) {
        const anyErr = err as { data?: unknown; message?: string }
        const dataMessage = typeof anyErr.data === "string" ? anyErr.data : undefined
        message = dataMessage ?? anyErr.message ?? message
      } else if (typeof err === "string") {
        message = err
      }
      toast.error(message)
    }
  }, [name, author, category, publishingHouse, publishYear, language, description, price, stock, pageNumber, images, createBook, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back + Header */}
        <div className="mb-6">
          {/* <Link
            to="/admin/books-list"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group mb-4"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Books
          </Link> */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <BookPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Add new book
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Fill in the details to add a new book to your store
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border-0 p-5 mb-5">
          <Label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 block">
            Book Images
          </Label>
          <FileUpload
            multiple
            accept="image/*"
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
            onChange={onFilesChange}
          />
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border-0 p-5 sm:p-6">
          <div className="space-y-5">
            {/* Book Name & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Book Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter book name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="author" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Author <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  type="text"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Category, Publishing House & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  type="text"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Fiction, Science"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="publishingHouse" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Publishing House
                </Label>
                <Input
                  id="publishingHouse"
                  type="text"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={publishingHouse}
                  onChange={(e) => setPublishingHouse(e.target.value)}
                  placeholder="Enter publisher"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Language
                </Label>
                <Input
                  id="language"
                  type="text"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="English"
                />
              </div>
            </div>

            {/* Publish Year, Price, Stock & Page Count */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="publishYear" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Publish Year
                </Label>
                <Input
                  id="publishYear"
                  type="number"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Price ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Stock <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pageNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Page Count
                </Label>
                <Input
                  id="pageNumber"
                  type="number"
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-vertical text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief description of the book..."
              />
            </div>

            {/* Divider + Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Fields marked with <span className="text-red-500">*</span> are required
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/admin/books-list"
                  className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <BookPlus className="h-4 w-4" />
                      Create Book
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BooksForm