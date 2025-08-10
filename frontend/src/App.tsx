import {Outlet} from "react-router-dom"
import Header from "./components/header"
import { useSelector } from "react-redux"
import type { RootState } from "./redux/features/store"
function App() {
  const {userInfo} = useSelector((state: RootState) => state.auth)
  
  return (
    <>
      {/* Chỉ hiển thị Header nếu user KHÔNG phải admin */}
      {userInfo?.role !== "admin" && <Header/>}
      
      <main className="py-3">
        <Outlet/>
      </main>
    </>
  )
}

export default App
