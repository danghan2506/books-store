import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL || "http://localhost:5000",
  credentials: "include",
});
const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Book", "Order"],
  endpoints: () => ({}),
});
export default apiSlice;
