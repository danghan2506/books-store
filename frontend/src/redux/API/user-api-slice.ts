import apiSlice from "./api-slice";
import { USERS_URL } from "../features/constants";
import type { UserInterface } from "@/types/user-type";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: builder.query<UserInterface[], void>({
      query: () => ({
        url: `${USERS_URL}/all-users`,
        method: "GET",
      }),
    }),
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});
export const {
  useLoginMutation,useLogoutMutation,useSignupMutation,useGetAllUsersQuery,useGetUserProfileQuery, useDeleteUserMutation, useUpdateUserProfileMutation} = userApiSlice;
