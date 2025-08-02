import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Book } from "@/types/books-type";

const favouriteSlice = createSlice({
    name: "favourites",
    initialState: [] as Book[],
    reducers: {
        addToFavourite: (state, action: PayloadAction<Book>) => {
            if(!state.some((item) => item._id === action.payload._id)){
                state.push(action.payload)
            }
        },
        removeFromFavourites: (state, action: PayloadAction<string>) => {
            return state.filter(item => item._id !== action.payload);
        },
        setFavourites: (state, action: PayloadAction<Book[]>) => {
            return action.payload
        }
    }
})
export const {addToFavourite, removeFromFavourites, setFavourites} = favouriteSlice.actions
export const selectFavourites = (state: RootState) => state.favourites
export default favouriteSlice.reducer