import { useEffect, useState } from 'react'
import { useGetTopSalesBooksQuery} from '@/redux/API/book-api-slice'
import type { Book } from '@/types/books-type'
import Title from './title'
import BookItems from './books-items'
const TopSalesBooks = () => {
  const [topSalesBooks, setTopSalesBooks] = useState<Book[]>([])
  const {data} = useGetTopSalesBooksQuery()
  useEffect(() => {
    if(Array.isArray(data)){
      const books = data
      setTopSalesBooks(books)
    }
  }, [data])
  return (
    <section className='mx-auto max-w-[1440px] px-6 lg:px-12 py-16 bg-white'>
      <Title title1={"Popular"} title2={"Books"} titleStyles={"pb-10"} paraStyles={"!block"}/>
      <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10'>
      {topSalesBooks.map((book) => (
        <div key={book._id}>
          <BookItems book={book}/>
        </div>
      ))}
    </div>
    </section>
   
  )
}

export default TopSalesBooks