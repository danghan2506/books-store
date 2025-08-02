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

const debugLocalStorage = (userId?: string) : void => {
    const key = userId ? `favourites_${userId}` : "favourites"
    console.log(`Debug localStorage for key: ${key}`)
    console.log('All localStorage keys:', Object.keys(localStorage))
    console.log('Favourites data:', localStorage.getItem(key))
}

export {
    addFavouritesToLocalStorage, 
    removeFavouritesFromLocalStorage, 
    getFavouritesFromLocalStorage,
    clearFavouritesFromLocalStorage,
    debugLocalStorage
}
