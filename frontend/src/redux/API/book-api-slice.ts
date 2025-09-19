import apiSlice from "./api-slice";
import {type BookQueryResult, type Book } from "@/types/books-type";
import { BOOKS_URL } from "../features/constants";
const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query({
      query: () => ({
        url: `${BOOKS_URL}/all-books`,
        method: "GET",
      }),
      providesTags: (result) => {
    if (result?.books) {
      return [
        ...result.books.map(({ _id }: Book) => ({ type: 'Book', id: _id })),
        { type: 'Book', id: 'LIST' },  // ← Quan trọng: tag cho list
      ]
    }
    return [{ type: 'Book', id: 'LIST' }]
  },
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
    getBookDetails: builder.query<Book, string>({
      query: (id) => ({
        url: `${BOOKS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        {type: "Book", id: id}
      ]
    }), 
    createBook: builder.mutation<Book, FormData>({
      query: (data) => ({
        url: `${BOOKS_URL}/`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: [
        { type: 'Book', id: 'LIST' },
      ],
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
        method: "DELETE"
      }),
       invalidatesTags: (_result, _error, bookId) => [
        { type: 'Book', id: bookId },
        { type: 'Book', id: 'LIST' },
      ],
    }), 
    updateBook: builder.mutation({
      query: ({bookId, data}) => ({
        url: `${BOOKS_URL}/${bookId}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Book', id: bookId },    // Invalidate specific book
        { type: 'Book', id: 'LIST' },    // Invalidate books list
      ],
    }), 
    getAllCategories: builder.query<string[], void>({
      query: () => ({
        url: `${BOOKS_URL}/all-categories`,
        method: "GET",
      }),
    }),
    getBooks: builder.query<BookQueryResult, {keyword?: string ; page?: number}>({
      query: ({keyword, page}) => ({
        url: `${BOOKS_URL}`,
        method: "GET",
        params: {
      ...(keyword && {keyword}),
      ...(page && {page})
    }
      }),
      providesTags: (result) => {
        if (result?.books) {
          return [
            ...result.books.map(({ _id }: Book) => ({ type: 'Book' as const, id: _id })),
            { type: 'Book' as const, id: 'LIST' },
          ]
        }
        return [{ type: 'Book' as const, id: 'LIST' }]
      },
    }),
    createReviews: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}/reviews`,
        method: "POST",
        body: data
      })
    }
    ), 
    getBookBaseOnCategory: builder.query<Book[], { keyword?: string }>({
      query: ({ keyword }) => ({
        url: `${BOOKS_URL}/category/${keyword}`,
        method: "GET",
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
  useGetBookBaseOnCategoryQuery,
  useGetBookDetailsQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useCreateReviewsMutation
} = bookApiSlice;
