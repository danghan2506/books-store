import {
  Brain,
  BookOpen,
  BookOpenText,
  BookType,
  Search,
  Settings,
  DollarSign,
  Smile,
} from "lucide-react";
import {
  useGetBooksQuery,
  useGetBookBaseOnCategoryQuery,
  useGetAllCategoriesQuery,
} from "@/redux/API/book-api-slice";
import { useState } from "react";
import Title from "@/components/title";
import type { Book } from "@/types/books-type";
import BookItems from "@/components/books-items";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"relevant" | "low" | "high">("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Lấy tất cả categories
  const {
    data: allCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  const slugify = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  
  // Lấy books theo từ khóa tìm kiếm (khi không có category được chọn)
  const {
    data,
    isLoading: bookLoading,
    error: bookError,
  } = useGetBooksQuery(
    { 
      keyword: searchTerm,
      page: currentPage 
    },
    { skip: !!selectedCategoryName } // Skip khi có category được chọn
  );
  
  // Lấy books theo category (khi có category được chọn)
  const {
    data: categoryBooks = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetBookBaseOnCategoryQuery(
    { 
      keyword: selectedCategoryName ? slugify(selectedCategoryName) : ""
    },
    { skip: !selectedCategoryName }
  );
  console.log({ categorySlug: selectedCategoryName ? slugify(selectedCategoryName) : null, categoryBooks, categoryError })
  // Xác định books để hiển thị
  const books = selectedCategoryName 
    ? categoryBooks
    : (data?.books || []);
  
  const totalPages = selectedCategoryName 
    ? 1
    : (data?.pages || 1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi search
    // Reset category khi search
    if (selectedCategoryName) {
      setSelectedCategoryName(null);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategoryName((prev) =>
      prev === categoryName ? null : categoryName
    );
    setCurrentPage(1); // Reset về trang 1 khi chọn category
    // Clear search khi chọn category
    if (searchTerm) {
      setSearchTerm("");
    }
  };

  const sortBooks = (books: Book[]) => {
    if (sortBy === "relevant") return books;

    return [...books].sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;

      if (sortBy === "low") {
        return priceA - priceB; // Thấp đến cao
      } else {
        return priceB - priceA; // Cao đến thấp
      }
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "relevant" | "low" | "high");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const GENRE_ICONS: Record<string, React.ReactNode> = {
  "Văn học": <BookOpen size={44} />,
  "Truyện tranh": <Smile size={44} />,
  "Kinh tế": <DollarSign size={44} />,
  "Tâm lý-Kỹ năng sống": <Brain size={44} />,
  "Tiểu sử hồi ký": <BookOpenText size={44} />,
  "Sách học ngoại ngữ": <BookType size={44} />
  };

  // Loading states
  if (categoriesLoading || bookLoading) return <p>Loading...</p>;
  
  // Error handling
  if (categoriesError || bookError) {
    console.error('Error:', categoriesError || bookError);
    return <p>Something went wrong! Please check the console for details.</p>;
  }

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 bg-white">
      <div className="pt-28">
        {/* Search bar */}
        <div className="w-full max-w-2xl flex items-center justify-center">
          <div className="inline-flex items-center justify-center bg-zinc-50 overflow-hidden w-full rounded-full p-4 px-5">
            <Search className="text-lg" />
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border-none outline-none w-full text-sm pl-4 bg-zinc-50"
            />
            <Settings className="text-lg cursor-pointer pl-2" />
          </div>
        </div>

        {/* Category filter */}
        <div className="mt-12 mb-16">
          <h4 className="text-[16px] md:text-[17px] mb-2 font-bold hidden sm:flex">
            Categories:
          </h4>
          <div className="flex items-center justify-center sm:justify-start flex-wrap gap-x-12 gap-y-4">
            {allCategories.map((categoryName) => (
              <div
                key={categoryName}
                onClick={() => handleCategoryClick(categoryName)}
                className={`flex items-center justify-center flex-col gap-2 cursor-pointer transition-colors duration-200 ${
                  selectedCategoryName === categoryName
                    ? "text-blue-500"
                    : "hover:text-blue-300"
                }`}
              >
                <div className={`flex items-center justify-center rounded-full h-20 w-20 transition-colors duration-200 ${
                  selectedCategoryName === categoryName
                    ? "bg-blue-100"
                    : "bg-zinc-50 hover:bg-zinc-100"
                }`}>
                  <span className="object-cover h-10 w-10">
                    {GENRE_ICONS[categoryName] ?? <DollarSign />}
                  </span>
                </div>
                <span className="text-[14px] font-[500]">
                  {categoryName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Book List Header */}
        <div className="flex items-center justify-between gap-7 flex-wrap pb-16 max-sm:flex-col text-center">
          <Title
            title1={"Our"}
            title2={"Books List"}
            titleStyles={"pb-0 text-start"}
            paraStyles={"!block"}
          />
          <div className="flex items-center justify-center gap-x-2">
            <span className="hidden sm:flex text-[16px] font-[500]">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort by"
              className="text-sm p-2.5 outline-none bg-zinc-50 text-gray-800 rounded"
            >
              <option value="relevant">Relevant</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Loading and Error states for books */}
        {categoryLoading && <p>Loading category books...</p>}
        {categoryError && (
          <p className="text-red-500 text-sm">Failed to load category books.</p>
        )}

        {/* Book Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {sortBooks(books).map((book: Book) => (
            <BookItems book={book} key={book._id} />
          ))}
        </div>

        {/* No books message */}
        {books.length === 0 && !categoryLoading && !bookLoading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {selectedCategoryName ? "No books found in this category." : "No books found."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-14 mb-10 gap-4">
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)} 
            className={`bg-zinc-200 ring-1 ring-zinc-200 text-gray-700 px-3 py-1 rounded-full transition-all duration-300 hover:bg-zinc-300 ${
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          {/* Page numbers */}
          {Array.from({length: totalPages}, (_, index) => (
            <button 
              key={index + 1} 
              onClick={() => handlePageChange(index + 1)} 
              className={`bg-zinc-200 ring-1 ring-zinc-200 text-gray-700 px-3 py-1 rounded-full hover:bg-zinc-300 transition-all duration-300 ${
                currentPage === index + 1 && "!bg-blue-500 !text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next button */}
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)} 
            className={`bg-zinc-200 ring-1 ring-zinc-200 text-gray-700 px-3 py-1 rounded-full transition-all duration-300 hover:bg-zinc-300 ${
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Shop;