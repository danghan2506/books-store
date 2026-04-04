import { useSelector } from 'react-redux'
import {  Outlet , Navigate} from 'react-router-dom'
import type { RootState } from '@/redux/features/store'
const PrivateRoutes = () => {
const {userInfo} = useSelector((state: RootState) => state.auth)
   
   // Redirect admins to admin dashboard
   if (userInfo && userInfo.role === "admin") {
      return <Navigate to="/admin" replace />
   }
   
   // Redirect unauthenticated users to login
   return userInfo ? <Outlet/> : <Navigate to="/login" replace/>
}

export default PrivateRoutes