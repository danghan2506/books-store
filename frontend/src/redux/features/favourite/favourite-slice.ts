import { createSlice } from "@reduxjs/toolkit";
const favouriteSlice = createSlice({
    name: "favourite",
    initialState: [],
    reducers: {
        addToFavourite: (state, action) => {
            if(!state.some(item => item._id === action.payload.id)){
                state.push(action.payload)
            }
        },
        removeFromFavourites: (state, action) => {
            return state.filter(item => item._id !== action.payload);
        },
        setFavourites: (state, action) => {
            return action.payload
        }
    }
})
export const {addToFavourite, removeFromFavourites, setFavourites} = favouriteSlice.actions
export const selectFavourites = (state) => state.action
export default favouriteSlice.reducer