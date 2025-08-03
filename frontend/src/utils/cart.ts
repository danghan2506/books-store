import type { CartState, OrderItems } from "@/types/order-type"
export const addDecimals = (num: number) : string  => {
    return (Math.round(num * 100) /100).toFixed(2)
}
export const updateCart = (state: CartState, userId?: string | null) => {
    state.itemsPrice = Number(addDecimals(
        state.cartItems.reduce((acc : number, item : OrderItems) => acc + item.price * item.quantity, 0)
    ))
    state.shippingPrice = Number(addDecimals(state.itemsPrice > 100 ? 0 : 3))
    state.taxPrice = Number(addDecimals(Number((0.05 * state.itemsPrice).toFixed(2))))
    state.totalPrice = (
        Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice) 
    ).toFixed(2)
    const cartKey = userId ? `cartItems_${userId}` : "cartItems"
    localStorage.setItem(cartKey, JSON.stringify(state))
    return state
}