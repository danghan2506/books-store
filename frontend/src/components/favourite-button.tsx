import { addToFavourite, removeFromFavourites } from '@/redux/features/favourite/favourite-slice'
import { useDispatch } from 'react-redux'
import { addFavouritesToLocalStorage, removeFavouritesFromLocalStorage } from '@/utils/local-storage'
import { Heart } from 'lucide-react'
import type { Book } from '@/types/books-type'
import { useFavourites } from '@/hooks/useFavourites'

interface FavouriteButtonProps {
  book: Book;
}

const FavouriteButton = ({book} : FavouriteButtonProps) => {
  const dispatch = useDispatch()
  const { favourites, userId } = useFavourites()
  const isFavourite = favourites.some((b: Book) => b._id === book._id)

  const toggleFavourite = () => {
    if (!userId) {
      // Handle case when user is not logged in
      alert('Please login to add favourites')
      return
    }
    
    if(isFavourite){
        console.log('FavouriteButton: Removing from favourites', { bookId: book._id, userId })
        dispatch(removeFromFavourites(book._id))
        removeFavouritesFromLocalStorage(book._id, userId)
    }
    else{
        console.log('FavouriteButton: Adding to favourites', { bookId: book._id, userId })
        dispatch(addToFavourite(book))
        addFavouritesToLocalStorage(book, userId)
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