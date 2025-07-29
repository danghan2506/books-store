import apiSlice from "./api-slice";
import type { Book } from "@/types/books-type";
import { BOOKS_URL } from "../features/constants";
const bookApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
       getAllBooks: builder.query<Book[], void>({
            query: () => ({
                url: `${BOOKS_URL}/all-books`,
                method: "GET",
            })
       }),
})
})
export const {useGetAllBooksQuery} = bookApiSlice