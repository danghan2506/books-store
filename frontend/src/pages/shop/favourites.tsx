import { useSelector } from 'react-redux'
import BookItems from '@/components/books-items'
import type { RootState } from '@/redux/features/store'
import type { Book } from '@/types/books-type'

const Favourite = () => {
    const favourites = useSelector((state: RootState) => state.favourites)
    
    return (
        <div className="pt-20 bg-gray-50 min-h-screen">
            <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        FAVOURITE PRODUCTS
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        {favourites.length} {favourites.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>

                {/* Content Section */}
                {favourites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No favourites yet</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            Start browsing and add books to your favourites to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {favourites.map((book: Book) => (
                            <BookItems key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favourite