import Title from './title'
import {Swiper, SwiperSlide} from 'swiper/react'
// @ts-expect-error // Swiper styles
import 'swiper/css'
// @ts-expect-error // Swiper styles
import 'swiper/css/pagination'
// @ts-expect-error // Swiper styles
import 'swiper/css/navigation'
import {Autoplay, Pagination} from "swiper/modules"
import { useGetNewBooksQuery } from '@/redux/API/book-api-slice'
import { useEffect, useState } from 'react'
import type { Book } from '@/types/books-type'
import BookItems from './books-items'
const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const {data} = useGetNewBooksQuery()
  useEffect(() => {
    if (Array.isArray(data)) {
      const books = data.slice(0, 7);
      setNewArrivals(books);
    }
  }, [data])
  return (
    <section className='mx-auto max-w-[1440px] px-6 lg:px-12 py-16 bg-white'>
      <Title title1={'New'} title2={'Arrival'} 
      title1Styles={'pb-10'} paraStyles={'!block'}/>
      {/* Swiper */}
      <Swiper
        autoplay={{
        delay: 3500,
        disableOnInteraction: false
        }}
      pagination={{
        clickable: true
      }}
      breakpoints={{
        400:{
          slidesPerView: 2,
          spaceBetween: 30
        },
        700:{
          slidesPerView: 3,
          spaceBetween: 30
        },
        1024:{
          slidesPerView: 4,
          spaceBetween: 30
        },
        1200:{
          slidesPerView: 5,
          spaceBetween: 30
        },
      }}
      modules={[Pagination, Autoplay]}
      className='h-[455px] sm:h-[488px] xl:h-[499px] mt-5'
      >
        {newArrivals.map((book) => (
          <SwiperSlide key={book._id}>
            <BookItems book={book}/>
          </SwiperSlide>
        ))}
      </Swiper>
     
      

    </section>
  )
}

export default NewArrivals