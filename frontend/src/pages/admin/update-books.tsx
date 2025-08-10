import { useParams, useNavigate } from "react-router-dom";
import {
  useGetBookDetailsQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "@/redux/API/book-api-slice";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const UpdateBooks = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { data: bookData } = useGetBookDetailsQuery(bookId ?? "");
  const navigate = useNavigate();
  console.log(bookData)
  const [name, setName] = useState(bookData?.name || "");
  const [author, setAuthor] = useState(bookData?.author || "");
  const [description, setDescription] = useState(bookData?.description || "");
  const [price, setPrice] = useState(bookData?.price || "");
  const [category, setCategory] = useState(bookData?.category?.categoryName || "");
  const [publishingHouse, setPublishingHouse] = useState(bookData?.publishingHouse || "");
  const [publishYear, setPublishYear] = useState(bookData?.publishYear || "");
  const [language, setLanguage] = useState(bookData?.language || "");
  const [pageNumber, setPageNumber] = useState(bookData?.pageNumber || "");
  const [stock, setStock] = useState(bookData?.stock || "");
  const [updateBook, {isLoading}] = useUpdateBookMutation()
  const [deleteBook] = useDeleteBookMutation();
  useEffect(() => {
    if (bookData) {
      setName(bookData.name);
      setAuthor(bookData.author);
      setDescription(bookData.description);
      setPrice(bookData.price);
      setCategory(bookData.category.categoryName);
      setPublishingHouse(bookData.publishingHouse);
      setPublishYear(bookData.publishYear);
      setLanguage(bookData.language);
      setPageNumber(bookData.pageNumber);
      setStock(bookData.stock);
    }
  }, [bookData])
  const updateHandler = async () => {
    try{
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
        const data = await updateBook({bookId: bookId, data: formData}).unwrap()
        toast.success("Book updated successfully")
        navigate("/admin/books-list", {replace: true})
    }
    catch(err: any){
        console.error(err)
        toast.error(err?.data || "Failed to update book")
    }
  }
  return (
     <div className="container mx-auto px-4 py-6 pt-24 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Update Book</h1>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">Book Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="h-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter book name"
                  />
                </div>
                <div>
                  <Label htmlFor="author" className="text-sm font-medium text-gray-700 mb-1 block">Author</Label>
                  <Input
                    id="author"
                    type="text"
                    className="h-10"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>
              </div>
    
              {/* Publishing House, Year & Language */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="publishingHouse" className="text-sm font-medium text-gray-700 mb-1 block">Publishing House</Label>
                  <Input
                    id="publishingHouse"
                    type="text"
                    className="h-10"
                    value={publishingHouse}
                    onChange={(e) => setPublishingHouse(e.target.value)}
                    placeholder="Enter publisher"
                  />
                </div>
                <div>
                  <Label htmlFor="publishYear" className="text-sm font-medium text-gray-700 mb-1 block">Publish Year</Label>
                  <Input
                    id="publishYear"
                    type="number"
                    className="h-10"
                    value={publishYear}
                    onChange={(e) => setPublishYear(e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-1 block">Language</Label>
                  <Input
                    id="language"
                    type="text"
                    className="h-10"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="English"
                  />
                </div>
              </div>
    
              {/* Price, Stock & Page Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1 block">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    className="h-10"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="text-sm font-medium text-gray-700 mb-1 block">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    className="h-10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="pageNumber" className="text-sm font-medium text-gray-700 mb-1 block">Page Count</Label>
                  <Input
                    id="pageNumber"
                    type="number"
                    className="h-10"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
    
              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1 block">Category</Label>
                <Input
                  id="category"
                  type="text"
                  className="h-10"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Fiction, Non-fiction, Science"
                />
              </div>
    
              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter book description..."
                />
              </div>
    
              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={updateHandler}
                  disabled={isLoading}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {isLoading ? "Updating..." : "Update Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
  );
};

export default UpdateBooks;
