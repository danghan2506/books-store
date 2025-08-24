import {Outlet} from "react-router-dom"
import Header from "./components/header"
function App() {
  return (
    <>
      {/* Chỉ hiển thị Header nếu user KHÔNG phải admin */}

      <main className="py-3">
        <Header/>
        <Outlet/>
      </main>
    </>
  )
}

export default App
