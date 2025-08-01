import type { Book } from "@/types/books-type";

const getFavouritesFromLocalStorage = (): Book[] => {
    const favouritesJSON = localStorage.getItem("favourites")
    return favouritesJSON ? JSON.parse(favouritesJSON) : []
}
const addFavouritesToLocalStorage = (book: Book) : void => {
    const favourites = getFavouritesFromLocalStorage()
    if(!favourites.some((item) => item._id === book._id)){
        favourites.push(book)
        localStorage.setItem("favourites", JSON.stringify(favourites))
    }
}
const removeFavouritesFromLocalStorage = (bookId: string) : void => {
    const favourites = getFavouritesFromLocalStorage()
    const updatedFavourites = favourites.filter((book : Book) => book._id !== bookId)
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites))
}
export {addFavouritesToLocalStorage, removeFavouritesFromLocalStorage, getFavouritesFromLocalStorage}
