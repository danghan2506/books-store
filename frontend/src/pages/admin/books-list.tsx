import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from "@/redux/API/book-api-slice";
import moment from "moment";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
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
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Books
          </h2>
          <p className="text-muted-foreground mb-4">
            Something went wrong while loading the books. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }
  const handleDeleteClick = (bookId: string, bookName: string) => {
    setBookToDelete({ id: bookId, name: bookName });
  };
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this book?"
      );
      if (!confirm) return;
      const { data } = await deleteBook(bookToDelete.id);
      toast.success(`"${data.deletedBook?.name}" is deleted`, {});
      refetch();
    } catch (err: unknown) {
      console.error(err);
      let message = "Failed to delete book";
      if (typeof err === "object" && err !== null) {
        const anyErr = err as { data?: unknown; message?: string };
        const dataMessage =
          typeof anyErr.data === "string" ? anyErr.data : undefined;
        message = dataMessage ?? anyErr.message ?? message;
      } else if (typeof err === "string") {
        message = err;
      }
      toast.error(message);
    }
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 10;
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
  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 library-gradient bg-clip-text">
              Books Management
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Loading books...
                </span>
              ) : (
                `Showing ${books.length} books (Page ${currentPage} of ${totalPages})`
              )}
            </p>
          </div>

          <div className="w-full lg:w-80">
            <SearchInput
              value={keyword}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              placeholder="Search books by title..."
              isLoading={isFetching}
            />
          </div>
        </div>
      </div>

      {/* Table Container with Fixed Layout */}
      <Card className="shadow-medium overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minHeight: "500px" }} className="relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading books...</p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="w-20 sm:w-24 font-semibold">
                        Image
                      </TableHead>
                      <TableHead className="w-24 sm:w-32 hidden sm:table-cell font-semibold">
                        ID
                      </TableHead>
                      <TableHead className="min-w-[200px] font-semibold">
                        Book Name
                      </TableHead>
                      <TableHead className="w-20 sm:w-24 font-semibold">
                        Price
                      </TableHead>
                      <TableHead className="w-28 sm:w-32 hidden md:table-cell font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="w-32 sm:w-40 text-center font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.length > 0 ? (
                      books.map((book, index) => (
                        <TableRow
                          key={book._id}
                          className="hover:bg-muted/50 transition-smooth border-b border-border/50 animate-fade-in-up"
                          style={{
                            animationDelay: `${index * 50}ms`,
                          }}
                        >
                          <TableCell>
                            <div className="w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 shadow-soft">
                              <img
                                src={
                                  book.images?.[0]?.url ||
                                  "/placeholder-book.jpg"
                                }
                                alt={book.name}
                                className="w-full h-full object-cover transition-smooth hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder-book.jpg";
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="font-mono text-sm text-muted-foreground">
                              {book._id.slice(-8)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                                {book.name}
                              </h3>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-library-accent text-sm sm:text-base whitespace-nowrap">
                              ${book.price}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                              {moment(book.createdAt).format("MMM DD, YYYY")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 transition-smooth hover:shadow-soft"
                              >
                                <Link to={`/shop/${book._id}`}>
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 transition-smooth hover:shadow-soft"
                              >
                                <Link to={`/admin/update-books/${book._id}`}>
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteClick(book._id, book.name)
                                }
                                disabled={isDeleting}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 transition-smooth hover:shadow-soft"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        {/* Empty rows to maintain table height */}
                        {Array.from({ length: 10 }).map((_, index) => (
                          <TableRow key={`empty-${index}`} className="h-16">
                            <TableCell className="border-b border-border/50">
                              <div className="w-12 h-16 sm:w-16 sm:h-20 rounded-lg bg-muted/30 animate-pulse"></div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell border-b border-border/50">
                              <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
                            </TableCell>
                            <TableCell className="border-b border-border/50">
                              <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4"></div>
                            </TableCell>
                            <TableCell className="border-b border-border/50">
                              <div className="h-4 bg-muted/30 rounded animate-pulse w-16"></div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell border-b border-border/50">
                              <div className="h-4 bg-muted/30 rounded animate-pulse w-24"></div>
                            </TableCell>
                            <TableCell className="border-b border-border/50">
                              <div className="flex items-center justify-center gap-2">
                                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-muted/30 rounded animate-pulse"></div>
                                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-muted/30 rounded animate-pulse"></div>
                                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-muted/30 rounded animate-pulse"></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* Empty state message */}
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 border-0">
                            <div className="flex flex-col items-center justify-center h-full">
                              <EmptyState
                                type={
                                  keyword ? "no-search-results" : "no-books"
                                }
                                searchKeyword={keyword}
                                onReset={
                                  keyword ? handleSearchClear : undefined
                                }
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="mt-8 flex justify-center">
          <Card className="p-2 shadow-soft">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={`transition-smooth ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-accent"
                    }`}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer transition-smooth hover:bg-accent"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => hasMore && handlePageChange(currentPage + 1)}
                    className={`transition-smooth ${
                      !hasMore
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-accent"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Card>
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
  );
};

export default BooksList;
