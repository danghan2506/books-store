import {Outlet} from "react-router-dom"
import Header from "./components/header"
function App() {

  return (
    <>
      <Header/>
      <main className="py-3">
        <Outlet/>
      </main>
    </>
  )
}

export default App
