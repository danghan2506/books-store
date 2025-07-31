import apiSlice from "./api-slice";
import {type BookQueryResult, type Book } from "@/types/books-type";
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
        method: "GET",
      }),
    }),
    createBook: builder.mutation<Book[], void>({
      query: (data) => ({
        url: `${BOOKS_URL}/`,
        body: data,
        method: "POST",
      }),
    }),
    getAllCategories: builder.query<Book[], void>({
      query: () => ({
        url: `${BOOKS_URL}/all-categories`,
        method: "GET",
      }),
    }),
    getBooks: builder.query<BookQueryResult, {keyword?: string}>({
      query: ({keyword}) => ({
        url: `${BOOKS_URL}`,
        method: "GET",
        params: keyword ? {keyword} : {}
      })
    }),
    getBookBaseOnCategory: builder.query<Book[], {keyword?: string}>({
      query: ({keyword}) => ({
        url: `${BOOKS_URL}/category/${keyword}`,
        method: "GET",
        params: keyword ? {keyword} : {}
      })
    })
  }),
});
export const {
  useGetAllBooksQuery,
  useCreateBookMutation,
  useGetTopSalesBooksQuery,
  useGetNewBooksQuery,
  useGetAllCategoriesQuery, 
  useGetBooksQuery,
  useGetBookBaseOnCategoryQuery
} = bookApiSlice;
