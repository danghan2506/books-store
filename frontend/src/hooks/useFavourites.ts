import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFavourites } from '@/redux/features/favourite/favourite-slice'
import { getFavouritesFromLocalStorage } from '@/utils/local-storage'
import type { RootState } from '@/redux/features/store'

export const useFavourites = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const userId = userInfo?._id
  const favourites = useSelector((state: RootState) => state.favourites)
  const lastUserId = useRef<string | undefined>(undefined)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Load favourites when user changes or on first load
    if (userId !== lastUserId.current || !hasInitialized.current) { 
      if (userId) {
        // User is logged in - load their favourites
        const favFromLocalStorage = getFavouritesFromLocalStorage(userId)
        dispatch(setFavourites(favFromLocalStorage))
      } else {
        // No user logged in - clear favourites from state but don't clear from localStorage
        dispatch(setFavourites([]))
      }
      lastUserId.current = userId
      hasInitialized.current = true
    }
  }, [userId, dispatch])

  return { favourites, userId, userInfo }
} 