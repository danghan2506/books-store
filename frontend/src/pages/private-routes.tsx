import { useSelector } from 'react-redux'
import {  Outlet , Navigate} from 'react-router-dom'
import type { RootState } from '@/redux/features/store'
const PrivateRoutes = () => {
const {userInfo} = useSelector((state: RootState) => state.auth)
   return userInfo ? <Outlet/> : <Navigate to="/login" replace/>
}

export default PrivateRoutes