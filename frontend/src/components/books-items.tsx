import type { Book } from "@/types/books-type";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { addFavouritesToLocalStorage, removeFavouritesFromLocalStorage, getFavouritesFromLocalStorage } from "@/utils/local-storage";
import type { RootState } from "@/redux/features/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import * as motion from "motion/react-client"
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
      toast.info("Removed from favourite list");
    } else {
      addFavouritesToLocalStorage(book, userInfo?._id);
      setIsFavourite(true);
      toast.success("Added to favourite list!");
    }
  };

  return (
    <Link to={`/shop/${book._id}`}>
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="cursor-pointer will-change-transform"
      >
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center bg-zinc-50 p-6 rounded-3xl overflow-hidden relative group"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            src={book.images && book.images.length > 0 ? book.images[0].url : '/placeholder-book.jpg'} 
            alt={book.slug}
            className="shadow-xl shadow-slate-900/30 rounded-lg w-full aspect-[3/4] object-cover mx-auto will-change-transform"
            loading="lazy"
          />
        </motion.div>
        
        <div className="p-3">
          <div className="flex items-center justify-between">
            <motion.h4 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-[12px] md:text-[14px] mb-2 font-bold line-clamp-4 !my-0"
            >
              {book.name}
            </motion.h4>
            
            <motion.span 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center h-8 w-8 rounded cursor-pointer hover:bg-neutral-200 will-change-transform"
              onClick={handleToggleFavourite}
            >
              <Heart className={`text-lg transition-colors duration-200 ${
                isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}/>
            </motion.span>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <motion.p 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-bold capitalize text-[12px]"
            >
              {book.category.categoryName}
            </motion.p>
            
            <motion.h5 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pr-2 font-bold text-red-400 hover:text-red-500"
            >
              $ {book.price}
            </motion.h5>
          </div>
          
          <motion.p 
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="line-clamp-2 py-1 text-gray-600"
          >
            {book.description}
          </motion.p>
        </div>
      </motion.div>
    </Link>
  );
};

export default BookItems;
