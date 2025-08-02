import {createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("userInfo")
const initialState = {
    userInfo: userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null
}
const expirationTime =  new Date().getTime() + 30 * 24 * 60 * 60 * 1000
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem("userInfo", JSON.stringify(action.payload))
            localStorage.setItem("expirationTime", expirationTime.toString())
        },
        logout: (state) => {
            // Don't clear favourites - keep them for when user logs back in
            state.userInfo = null
            // Only clear user authentication data, not favourites
            localStorage.removeItem("userInfo")
            localStorage.removeItem("expirationTime")
        }
    }
})
export const {setCredentials, logout} = authSlice.actions
export default authSlice.reducer