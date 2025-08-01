import { useSelector } from 'react-redux'
import BookItems from '@/components/books-items'
import type { RootState } from '@/redux/features/store'
import type { Book } from '@/types/books-type'

const Favourite = () => {
    const favourites = useSelector((state: RootState) => state.favourites)
  return (
     <div className='ml-[10rem]'>
         <h1 className="text-2xl sm:text-3xl font-bold text-black">
                FAVOURITE PRODUCTS
              </h1>
              <p className="text-gray-600 mt-1">
                {favourites.length} {favourites.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
        <div className='grid grid-cols-2  gap-4 p-4'>
            {favourites.map((book : Book)  => (
                <BookItems key={book._id} book={book}/>
            ))}
        </div>
    </div>
  )
}

export default Favourite