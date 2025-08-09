import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../features/constants"
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
})
const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User"],
    endpoints: () => ({})
})
export default apiSlice