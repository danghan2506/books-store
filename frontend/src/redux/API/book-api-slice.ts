import apiSlice from "./api-slice";
import type { Book } from "@/types/books-type";
import { BOOKS_URL } from "../features/constants";
const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query<Book[], void>({
      query: () => ({
        url: `${BOOKS_URL}/all-books`,
        method: "GET",
      }),
    }),
    getTopSalesBooks: builder.query<Book[], void>({
      query: () => ({
        url: `${BOOKS_URL}/top-sales`,
        method: "GET",
      }),
    }),
    getNewBooks: builder.query<Book[], void>({
      query: () => ({
        url: `${BOOKS_URL}/new-books`,
        method: "GET"
      })
    }), 
    createBook: builder.mutation<Book[], void>({
      query: (data) => ({
        url: `${BOOKS_URL}/`,
        body: data,
        method: "POST",
      }),
    }),
  }),
});
export const { useGetAllBooksQuery, useCreateBookMutation, useGetTopSalesBooksQuery, useGetNewBooksQuery } = bookApiSlice;
