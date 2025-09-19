import { AUTH_URL } from "../features/constants";
import apiSlice from "./api-slice";
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        requestPasswordReset: builder.mutation({
            query: (email) => ({
                url: `${AUTH_URL}/request`,
                method: "POST",
                body: email
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
export const{useRequestPasswordResetMutation, useResetPasswordMutation, useVerifyOtpMutation} = authApiSlice