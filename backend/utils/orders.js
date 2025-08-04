const calculatePrice = (orderItems) => {
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 30 ? 0 : 3
    const taxRate = 0.05
    const taxPrice = (itemsPrice * taxRate).toFixed(2)
    const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2)
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice,
        totalPrice
    }
}
export default calculatePrice