import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constants";
import { logout } from "../features/auth/auth-slice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL || "http://localhost:5000",
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log("🔄 RTK Query calling:", args);
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.warn("❌ Request failed with error:", result.error);
  }

  if (result.error && result.error.status === 401) {
    console.log("🔑 Access token expired (401). Attempting to refresh token...");
    // Attempt to get a new access token
    const refreshResult = await baseQuery(
      {
        url: "/api/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    console.log("🔄 Refresh result received:", refreshResult);

    if (refreshResult.data) {
      console.log("✅ Refresh token successful! Retrying original request...");
      // Retry the initial query with the new access token cookie
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.error("❌ Refresh token failed or expired. Logging out user...");
      // Refresh token is expired or invalid, log out the user
      api.dispatch(logout());
    }
  }
  return result;
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Book", "Order"],
  endpoints: () => ({}),
});

export default apiSlice;
