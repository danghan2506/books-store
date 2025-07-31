import {
  BookA,
  BookOpen,
  Flame,
  Medal,
  Search,
  Settings,
  Smile,
  DollarSign,
} from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useGetBooksQuery,
  useGetBookBaseOnCategoryQuery,
} from "@/redux/API/book-api-slice";
import { useEffect, useState } from "react";
import Title from "@/components/title";
import type { Book } from "@/types/books-type";
import BookItems from "@/components/books-items";

const Shop = () => {
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data,
    isLoading: bookLoading,
    error: bookError,
  } = useGetBooksQuery({ keyword: searchTerm });
  const books = data?.books || [];

  const {
    data: filteredBooks,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetBookBaseOnCategoryQuery(
    { keyword: selectedCategory || "" },
    { skip: !selectedCategory }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const GENRE_ICONS: Record<string, React.ReactNode> = {
    "Kinh tế": <DollarSign size={44} />,
    "Tâm lý": <DollarSign size={44} />,
    "Tình cảm": <DollarSign size={44} />,
    "Hành động": <Flame size={44} />,
    "Bóng đá": <Medal size={44} />,
    "Thiếu nhi": <Smile size={44} />,
    "Vui nhộn": <Smile size={44} />,
    "Truyện ngắn": <BookA size={44} />,
    "Truyện tranh": <BookOpen size={44} />,
    "Sách tiếng việt": <BookA size={44} />,
  };

  useEffect(() => {
    if (Array.isArray(categories)) {
      setAllCategories(categories);
    }
  }, [categories]);

  if (isLoading || bookLoading) return <p>Loading books...</p>;
  if (error || bookError) return <p>Something went wrong!</p>;

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
            {allCategories.map((category) => (
              <label
                key={category}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category ? null : category
                  )
                }
              >
                <input type="checkbox" className="hidden peer" />
                <div
                  className={`flex items-center justify-center flex-col gap-2 cursor-pointer peer-checked:text-blue-300 ${
                    selectedCategory === category ? "text-blue-300" : ""
                  }`}
                >
                  <div className="flex items-center justify-center rounded-full bg-zinc-50 h-20 w-20">
                    <span className="object-cover h-10 w-10">
                      {GENRE_ICONS[category] ?? <DollarSign />}
                    </span>
                  </div>
                  <span className="text-[14px] font-[500]">{category}</span>
                </div>
              </label>
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
            <select className="text-sm p-2.5 outline-none bg-zinc-50 text-gray-800 rounded">
              <option value="relevant">Relevant</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        {categoryLoading && <p>Loading category books...</p>}
        {categoryError && <p>Failed to load category books.</p>}

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {(selectedCategory ? filteredBooks || [] : books).map(
            (book: Book) => (
              <BookItems book={book} key={book._id} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Shop;
