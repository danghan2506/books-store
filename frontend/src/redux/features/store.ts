import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query/react"
import apiSlice from "../API/api-slice"
import authReducer from './auth/auth-slice'
import favouriteReducer from '../features/favourite/favourite-slice'
import cartReducer from './cart/cart-slice'
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authReducer, 
        favourites: favouriteReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), 
    devTools: true
})
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>