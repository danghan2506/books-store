import React from 'react'
import type { Book } from '@/types/books-type'
import { ShoppingBag } from 'lucide-react'
const BooksItems = ({book} : Book) => {
  return (
    <div>
 <div>
        <img src={book.image[0]} alt={book.slug} className='shadow-xl shadow-slate-900/30 rounded-lg' width={480} height={480}></img>
    </div>
    <div className='p-3'>
      <div>
        <h4>{book.name}</h4>
        <span><ShoppingBag className='text-lg'/></span>
      </div>
      <div>
        <p>{book.type.typeName}</p>
        <h5>{book.price} VNĐ</h5>
      </div>
    </div>
    </div>
   
  )
}

export default BooksItems