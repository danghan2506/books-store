import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query/react"
import apiSlice from "../API/api-slice"
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    devTools: true
})
setupListeners(store.dispatch)