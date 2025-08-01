import { addToFavourite, removeFromFavourites, setFavourites } from '@/redux/features/favourite/favourite-slice'
import { useDispatch, useSelector } from 'react-redux'
import { addFavouritesToLocalStorage, removeFavouritesFromLocalStorage, getFavouritesFromLocalStorage } from '@/utils/local-storage'
import { Heart } from 'lucide-react'
import type { RootState } from '@/redux/features/store'
import type { Book } from '@/types/books-type'
import { useEffect } from 'react'
import {toast} from "sonner"
interface FavouriteButtonProps {
  book: Book;
}
const FavouriteButton = ({book} : FavouriteButtonProps) => {
  const dispatch = useDispatch()
  const favourite = useSelector((state: RootState) => state.favourites)
  const isFavourite = favourite.some((b: Book) => b._id === book._id)
  useEffect(() => {
    const favFromLocalStorage = getFavouritesFromLocalStorage()
    dispatch(setFavourites(favFromLocalStorage))
  }, [])
  const toggleFavourite = () => {
    if(isFavourite){
        dispatch(removeFromFavourites(book._id))
        removeFavouritesFromLocalStorage(book._id)
    }
    else{
        dispatch(addToFavourite(book))
        addFavouritesToLocalStorage(book)
    }
  }
  return (
    <div 
      className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${
        isFavourite 
          ? 'bg-rose-100 hover:bg-rose-200' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`} 
      onClick={toggleFavourite}
    >
      {isFavourite ? (
        <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
      ) : (
        <Heart className="h-5 w-5 text-gray-600 hover:text-rose-500 transition-colors duration-200" />
      )}
    </div>
  )

}

export default FavouriteButton