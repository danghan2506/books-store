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
    } catch (err: any) {
      console.error(err)
      toast.error(err?.data || "Failed to create book")
    }
  }, [name, author, category, publishingHouse, publishYear, language, description, price, stock, pageNumber, images, createBook, navigate])
  return (
      <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">
          <div className="mb-3">
            <Label className="py-2">Images</Label>
            <FileUpload multiple accept="image/*" maxFiles={5} maxSize={10 * 1024 * 1024} onChange={onFilesChange} />
          </div>

          <div className="p-3">
  <div className="flex flex-wrap gap-6 mb-4">
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="name" className="py-2">Name</Label>
      <Input
        type="text"
        className="p-4 mb-3 w-full border rounded-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="price" className="py-2">Price</Label>
      <Input
        type="number"
        className="p-4 mb-3 w-full border rounded-lg"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
  </div>
  <div className="flex flex-wrap gap-6 mb-4">
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="author" className="py-2">Author</Label>
      <Input
        type="text"
        className="p-4 mb-3 w-full border rounded-lg"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="publishingHouse" className="py-2">Publishing House</Label>
      <Input
        type="text"
        className="p-4 mb-3 w-full border rounded-lg"
        value={publishingHouse}
        onChange={(e) => setPublishingHouse(e.target.value)}
      />
    </div>
  </div>
  <div className="flex flex-wrap gap-6 mb-4">
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="stock" className="py-2">Stock</Label>
      <Input
        type="number"
        className="p-4 mb-3 w-full border rounded-lg"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="publishYear" className="py-2">Publish Year</Label>
      <Input
        type="number"
        className="p-4 mb-3 w-full border rounded-lg"
        value={publishYear}
        onChange={(e) => setPublishYear(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="language" className="py-2">Language</Label>
      <Input
        type="text"
        className="p-4 mb-3 w-full border rounded-lg"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
    </div>
    <div className="flex-1 min-w-[220px]">
      <Label htmlFor="pageNumber" className="py-2">Page Number</Label>
      <Input
        type="number"
        className="p-4 mb-3 w-full border rounded-lg"
        value={pageNumber}
        onChange={(e) => setPageNumber(e.target.value)}
      />
    </div>
  </div>
  <div className="mb-4">
    <Label htmlFor="category" className="py-2">Category</Label>
    <Input
      placeholder="e.g. Fiction"
      className="p-4 mb-3 w-full border rounded-lg"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />
  </div>
  <div className="mb-4">
    <Label htmlFor="description" className="py-2">Description</Label>
    <textarea
      className="p-2 mb-3 border rounded-lg w-full"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    ></textarea>
  </div>
  <button
    type="button"
    onClick={handleSubmit}
    className="py-4 px-10 mt-5 rounded-md text-md font-light bg-slate-700 cursor-pointer flex-col items-center."
  >
    {isLoading ? "Submitting..." : "Submit"}
  </button>
</div>
        </div>
      </div>
    </div>
  )
}

export default BooksForm