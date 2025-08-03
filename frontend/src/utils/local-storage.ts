import type { Book } from "@/types/books-type";
const getFavouritesFromLocalStorage = (userId?: string): Book[] => {
    const key = userId ? `favourites_${userId}` : "favourites"
    const favouritesJSON = localStorage.getItem(key)
    return favouritesJSON ? JSON.parse(favouritesJSON) : []
}

const addFavouritesToLocalStorage = (book: Book, userId?: string) : void => {
    const key = userId ? `favourites_${userId}` : "favourites"
    const favourites = getFavouritesFromLocalStorage(userId)
    if(!favourites.some((item) => item._id === book._id)){
        favourites.push(book)
        localStorage.setItem(key, JSON.stringify(favourites))
    }
}

const removeFavouritesFromLocalStorage = (bookId: string, userId?: string) : void => {
    const key = userId ? `favourites_${userId}` : "favourites"
    const favourites = getFavouritesFromLocalStorage(userId)
    const updatedFavourites = favourites.filter((book : Book) => book._id !== bookId)
    localStorage.setItem(key, JSON.stringify(updatedFavourites))
}

const clearFavouritesFromLocalStorage = (userId?: string) : void => {
    const key = userId ? `favourites_${userId}` : "favourites"
    localStorage.removeItem(key)
}

const getCartItemsFromLocalStorage = (userId?: string) => {
    const key = userId ? `cartItems_${userId}` : "cartItems"
    const cartItemsJSON = localStorage.getItem(key)
    return cartItemsJSON ? JSON.parse(cartItemsJSON) : {cartItems: [], shippingAddress: {}, paymentMethod: "PayPal"}
}

export {
    addFavouritesToLocalStorage, 
    removeFavouritesFromLocalStorage, 
    getFavouritesFromLocalStorage,
    clearFavouritesFromLocalStorage,
    getCartItemsFromLocalStorage
}
