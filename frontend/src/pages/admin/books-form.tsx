import { useCallback, useState } from "react"
import { useCreateBookMutation } from "@/redux/API/book-api-slice"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/comp-549";
import { toast } from "sonner";
import { useNavigate } from "react-router";
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
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 lg:ml-[160px] xl:ml-[60px] lg:pr-2 xl:pr-4">
    <div className="max-w-5xl md:max-w-6xl mx-auto">
      <div className="rounded-lg border p-4 sm:p-6 lg:p-8 bg-transparent">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
          Add New Book
        </h1>
        
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
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

          {/* Book Name & Author - Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                Book Name
              </Label>
              <Input
                id="name"
                type="text"
                className="h-10 sm:h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter book name"
              />
            </div>
            <div>
              <Label htmlFor="author" className="text-sm font-medium text-gray-700 mb-1 block">
                Author
              </Label>
              <Input
                id="author"
                type="text"
                className="h-10 sm:h-11"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </div>
          </div>

          {/* Publishing House, Year & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="publishingHouse" className="text-sm font-medium text-gray-700 mb-1 block">
                Publishing House
              </Label>
              <Input
                id="publishingHouse"
                type="text"
                className="h-10 sm:h-11"
                value={publishingHouse}
                onChange={(e) => setPublishingHouse(e.target.value)}
                placeholder="Enter publisher"
              />
            </div>
            <div>
              <Label htmlFor="publishYear" className="text-sm font-medium text-gray-700 mb-1 block">
                Publish Year
              </Label>
              <Input
                id="publishYear"
                type="number"
                className="h-10 sm:h-11"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                placeholder="2024"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-1 block">
                Language
              </Label>
              <Input
                id="language"
                type="text"
                className="h-10 sm:h-11"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="English"
              />
            </div>
          </div>

          {/* Price, Stock & Page Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1 block">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                className="h-10 sm:h-11"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm font-medium text-gray-700 mb-1 block">
                Stock Quantity
              </Label>
              <Input
                id="stock"
                type="number"
                className="h-10 sm:h-11"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="pageNumber" className="text-sm font-medium text-gray-700 mb-1 block">
                Page Count
              </Label>
              <Input
                id="pageNumber"
                type="number"
                className="h-10 sm:h-11"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1 block">
              Category
            </Label>
            <Input
              id="category"
              type="text"
              className="h-10 sm:h-11"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Fiction, Non-fiction, Science"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] sm:min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              {isLoading ? "Adding Book to database..." : "Create Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

}

export default BooksForm