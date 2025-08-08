import { useGetAllBooksQuery } from "@/redux/API/book-api-slice"
import moment from "moment"
import { Link } from "react-router-dom"
import { Edit, Trash2, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
const BooksList = () => {
    const {data: books, isLoading, error} = useGetAllBooksQuery()
    if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading products</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Books Management</h1>
        <p className="text-gray-600">Total Books: {books?.length || 0}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 sm:w-24">Image</TableHead>
              <TableHead className="w-24 sm:w-32 hidden sm:table-cell">ID</TableHead>
              <TableHead className="min-w-[200px]">Book Name</TableHead>
              <TableHead className="w-20 sm:w-24">Price</TableHead>
              <TableHead className="w-28 sm:w-32 hidden md:table-cell">Date</TableHead>
              <TableHead className="w-32 sm:w-40 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books?.map((book) => (
              <TableRow key={book._id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="w-12 h-16 sm:w-16 sm:h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={book.images?.[0]?.url || "/placeholder-book.jpg"}
                      alt={book.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-book.jpg"
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="font-mono text-sm text-gray-600">
                    {book._id.slice(-8)}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                      {book.name}
                    </h3>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600 text-sm sm:text-base whitespace-nowrap">
                    ${book.price}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {moment(book.createdAt).format("MMM DD, YYYY")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    >
                      <Link to={`/shop/${book._id}`}>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    >
                      <Link to={`/admin/product/update/${book._id}`}>
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBook(book._id)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

        {(!books || books.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BooksList