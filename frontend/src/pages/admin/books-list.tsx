import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from "@/redux/API/book-api-slice";
import moment from "moment";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, AlertTriangle, BookA, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingSpinner } from "@/components/loading-spinner";

const BooksList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading, error, refetch, isFetching } = useGetBooksQuery({
    page: currentPage,
    keyword: debouncedKeyword,
  });
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const [bookToDelete, setBookToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const books = data?.books || [];
  const totalPages = data?.pages || 1;
  const hasMore = data?.hasMore || false;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchClear = useCallback(() => {
    setKeyword("");
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword]);

  const handleDeleteClick = (bookId: string, bookName: string) => {
    setBookToDelete({ id: bookId, name: bookName });
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      const { data } = await deleteBook(bookToDelete.id);
      toast.success(`"${data.deletedBook?.name}" is deleted`);
      setBookToDelete(null);
      refetch();
    } catch (err: unknown) {
      toast.error(err as string);
      setBookToDelete(null);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-80 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Something went wrong while loading the books. Please try again.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <BookA className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  Books Management
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {isFetching ? (
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Loading books...
                    </span>
                  ) : (
                    `Showing ${books.length} books (Page ${currentPage} of ${totalPages})`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search books by title..."
              value={keyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 h-10 bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              disabled={isFetching}
            />
            {keyword && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchClear}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <span className="text-xs text-slate-400">✕</span>
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50 w-20">
                    Image
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Book ID
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Book Name
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Price
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Date
                  </th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr
                      key={book._id}
                      className="group hover:bg-blue-50/40 dark:hover:bg-slate-700/20 transition-colors duration-150"
                    >
                      <td className="px-5 py-4">
                        <div className="w-11 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-1 ring-slate-200/80 dark:ring-slate-600/50">
                          <img
                            src={
                              book.images?.[0]?.url ||
                              "/placeholder-book.jpg"
                            }
                            alt={book.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-book.jpg";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <code className="text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md font-mono text-slate-600 dark:text-slate-300">
                          #{book._id.slice(-8)}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                          {book.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          ${book.price}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {moment(book.createdAt).format("MMM DD, YYYY")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-colors duration-150"
                          >
                            <Link to={`/shop/${book._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-500/10 transition-colors duration-150"
                          >
                            <Link to={`/admin/update-books/${book._id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteClick(book._id, book.name)
                            }
                            disabled={isDeleting}
                            className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors duration-150"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-4">
                          <BookA className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {keyword ? "No books found" : "No books available"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                          {keyword
                            ? `No books matching "${keyword}". Try adjusting your search.`
                            : "There are no books in the library yet. Add some to get started."}
                        </p>
                        {keyword && (
                          <Button
                            variant="outline"
                            className="mt-4 cursor-pointer"
                            onClick={handleSearchClear}
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book._id}
                className="bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200"
              >
                <div className="flex gap-3">
                  <div className="w-14 h-[72px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-1 ring-slate-200/80 dark:ring-slate-600/50 flex-shrink-0">
                    <img
                      src={book.images?.[0]?.url || "/placeholder-book.jpg"}
                      alt={book.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-book.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <code className="text-xs bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400">
                        #{book._id.slice(-8)}
                      </code>
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {moment(book.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                      {book.name}
                    </h3>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      ${book.price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="cursor-pointer flex-1 h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors duration-150"
                  >
                    <Link to={`/shop/${book._id}`}>
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="cursor-pointer flex-1 h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-500/10 rounded-lg transition-colors duration-150"
                  >
                    <Link to={`/admin/update-books/${book._id}`}>
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(book._id, book.name)}
                    disabled={isDeleting}
                    className="cursor-pointer flex-1 h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-150"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-4">
                <BookA className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {keyword ? "No books found" : "No books available"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                {keyword
                  ? `No books matching "${keyword}". Try adjusting your search.`
                  : "There are no books in the library yet."}
              </p>
              {keyword && (
                <Button
                  variant="outline"
                  className="mt-4 cursor-pointer"
                  onClick={handleSearchClear}
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <span className="flex h-9 w-9 items-center justify-center text-slate-400">
                        ...
                      </span>
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      hasMore && handlePageChange(currentPage + 1)
                    }
                    className={
                      !hasMore
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!bookToDelete}
          onOpenChange={() => setBookToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{bookToDelete?.name}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBook}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Deleting...
                  </span>
                ) : (
                  "Delete Book"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BooksList;
