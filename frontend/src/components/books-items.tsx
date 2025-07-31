import React from "react";
import type { Book } from "@/types/books-type";
import { ShoppingBag } from "lucide-react";
interface BookItemsProps {
  book: Book;
}
const BookItems = ({ book }: BookItemsProps) => {
  return (
    <div>
      <div className="flex items-center justify-center bg-zinc-50 p-6 rounded-3xl overflow-hidden relative group">
        <img
          src={book.images[0].url}
          alt={book.slug}
          className="shadow-xl shadow-slate-900/30 rounded-lg w-full aspect-[3/4] object-cover mx-auto"
        ></img>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[12px] md:text-[14px] mb-2 font-bold line-clamp-4 !my-0">
            {book.name}
          </h4>
          <span className="flex items-center justify-center h-8 w-8 rounded cursor-pointer hover:bg-neutral-200">
            <ShoppingBag className="text-lg" />
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="font-bold capitalize text-[12px]">{book.category.categoryName}</p>
          <h5 className="tex-red-200 pr-2">{book.price} VNĐ</h5>
        </div>
        <p className="line-clamp-2 py-1">{book.description}</p>
      </div>
    </div>
  );
};

export default BookItems;
