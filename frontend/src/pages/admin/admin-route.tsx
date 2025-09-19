import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '@/redux/features/store'

const AdminRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  return userInfo && userInfo.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  )
}

export default AdminRoute
