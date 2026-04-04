import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '@/redux/features/store'

const AdminRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  
  // Allow only admin users
  if (userInfo && userInfo.role === "admin") {
    return <Outlet />
  }
  
  // Redirect non-admin authenticated users to home
  if (userInfo) {
    return <Navigate to="/" replace />
  }
  
  // Redirect unauthenticated users to login
  return <Navigate to="/login" replace />
}

export default AdminRoute
