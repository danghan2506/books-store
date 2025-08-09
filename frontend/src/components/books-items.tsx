import type { Book } from "@/types/books-type";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { addFavouritesToLocalStorage, removeFavouritesFromLocalStorage, getFavouritesFromLocalStorage } from "@/utils/local-storage";
import type { RootState } from "@/redux/features/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
interface BookItemsProps {
  book: Book;
}
const BookItems = ({ book }: BookItemsProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [isFavourite, setIsFavourite] = useState(false);
  
  // Check if book is in favourites on component mount
  useEffect(() => {
    const favourites = getFavouritesFromLocalStorage(userInfo?._id);
    setIsFavourite(favourites.some((item: any) => item._id === book._id));
  }, [book._id, userInfo?._id]);

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavourite) {
      removeFavouritesFromLocalStorage(book._id, userInfo?._id);
      setIsFavourite(false);
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } else {
      addFavouritesToLocalStorage(book, userInfo?._id);
      setIsFavourite(true);
      toast.success("Đã thêm vào danh sách yêu thích");
    }
  };

  return (
    <Link to={`/shop/${book._id}`}>
      <div>
        <div className="flex items-center justify-center bg-zinc-50 p-6 rounded-3xl overflow-hidden relative group">
          <img
            src={book.images && book.images.length > 0 ? book.images[0].url : '/placeholder-book.jpg'} 
            alt={book.slug}
            className="shadow-xl shadow-slate-900/30 rounded-lg w-full aspect-[3/4] object-cover mx-auto"
          ></img>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] md:text-[14px] mb-2 font-bold line-clamp-4 !my-0">
              {book.name}
            </h4>
            <span 
              className="flex items-center justify-center h-8 w-8 rounded cursor-pointer hover:bg-neutral-200"
              onClick={handleToggleFavourite}
            >
              <Heart className={`text-lg ${isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}/>
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="font-bold capitalize text-[12px]">{book.category.categoryName}</p>
            <h5 className="text-red-400 pr-2"> $ {book.price}</h5>
          </div>
          <p className="line-clamp-2 py-1">{book.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookItems;
