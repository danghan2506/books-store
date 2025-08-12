import { AUTH_URL } from "../features/constants";
import apiSlice from "./api-slice";
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        requestPasswordReset: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/request`,
                method: "POST",
                body: data
            })
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/verify`,
                method: "POST",
                body: data
            })
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/reset`,
                method: "POST",
                body: data,
            })
        })
    })
})
export const{useRequestPasswordResetMutation, useResetPasswordMutation, useVerifyOtpMutation} = authApiSlice