import { AUTH_URL } from "../features/constants";
import apiSlice from "./api-slice";
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
            login: builder.mutation({
              query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
              }),
            }),
            loginWithGoogle: builder.mutation({
              query: (token) => ({
                url: `${AUTH_URL}/login-with-google`,
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
            }),
            logout: builder.mutation<void, void>({
              query: () => ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
              }),
            }),
            signup: builder.mutation({
              query: (data) => ({
                url: `${AUTH_URL}/`,
                method: "POST",
                body: data,
              }),
            }),
        requestPasswordReset: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/request`,
                method: "POST",
                body: {email: data.email}
            })
        }),
        verifyOtp: builder.mutation({
            query: ({email, otp}) => ({
                url: `${AUTH_URL}/verify`,
                method: "POST",
                body: {email, otp}
            })
        }),
        resetPassword: builder.mutation({
            query: ({email, newPassword, confirmPassword}) => ({
                url: `${AUTH_URL}/reset`,
                method: "POST",
                body: {email, newPassword, confirmPassword},
            })
        })
    })
})
export const{useLoginMutation, useLoginWithGoogleMutation, useLogoutMutation, useSignupMutation, useRequestPasswordResetMutation, useResetPasswordMutation, useVerifyOtpMutation} = authApiSlice