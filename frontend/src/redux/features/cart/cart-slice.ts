import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { updateCart } from "@/utils/cart";
import { getCartItemsFromLocalStorage } from "@/utils/local-storage";
import type { CartState, OrderItems } from "@/types/order-type";

const initialState: CartState = {
    cartItems: [],
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: "0.00",
    shippingAddress: {
        username: "", 
        country: "",
        city: "",
        phoneNumber: "",
        district: "",
        address: ""
    },
    paymentMethod: "PayPal"
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        loadUserCart: (state, action: PayloadAction<string | undefined>) => {
            const userId = action.payload
            const cartData = getCartItemsFromLocalStorage(userId)
            state.cartItems = cartData.cartItems
            state.itemsPrice = cartData.itemsPrice
            state.shippingPrice = cartData.shippingPrice
            state.taxPrice = cartData.taxPrice
            state.totalPrice = cartData.totalPrice
            state.shippingAddress = cartData.shippingAddress
            state.paymentMethod = cartData.paymentMethod
        },
        addToCart: (state , action: PayloadAction<OrderItems & { userId?: string }>) => {
            const { userId , ...items } = action.payload
            const existItem = state.cartItems.find((x: OrderItems) => x._id === items._id)
            if (existItem) {
                state.cartItems = state.cartItems.map((x: OrderItems) => x._id === existItem._id ? { ...x, quantity: x.quantity + 1 } : x)
            } else {
                state.cartItems = [...state.cartItems, items]
            }
            updateCart(state, userId)
        },
        updateItemQuantity: (state, action: PayloadAction<{ itemId: string, quantity: number, userId?: string }>) => {
            const { itemId, quantity, userId } = action.payload
            state.cartItems = state.cartItems.map((x: OrderItems) =>
                x._id === itemId ? { ...x, quantity } : x
            )
            updateCart(state, userId)
        },
        removeFromCart: (state, action: PayloadAction<{ itemId: string, userId?: string }>) => {
            const { itemId, userId } = action.payload
            state.cartItems = state.cartItems.filter((x: OrderItems) => x._id !== itemId)
            updateCart(state, userId)
        },
        saveShippingAddress: (state, action: PayloadAction<{ address: CartState["shippingAddress"], userId?: string }>) => {
            const { address, userId } = action.payload
            state.shippingAddress = address
            const cartKey = userId ? `cartItems_${userId}` : "cartItems"
            localStorage.setItem(cartKey, JSON.stringify(state))
        },
        savePaymentMethod: (state, action: PayloadAction<{ method: string, userId?: string }>) => {
            const { method, userId } = action.payload
            state.paymentMethod = method
            const cartKey = userId ? `cartItems_${userId}` : "cartItems"
            localStorage.setItem(cartKey, JSON.stringify(state))
        },
          clearCartItems: (state, action: PayloadAction<string | undefined>) => {
            const userId = action.payload
            state.cartItems = []
            const cartKey = userId ? `cartItems_${userId}` : "cartItems"
            localStorage.setItem(cartKey, JSON.stringify(state))
        },
        resetCart: () => {
            return initialState
        }
    }
})
export const { addToCart, updateItemQuantity, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, loadUserCart } = cartSlice.actions
export default cartSlice.reducer