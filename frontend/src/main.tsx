import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import {store} from "./redux/features/store.ts"
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Login from './pages/auth/Login.tsx'
import { RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import { Toaster } from 'sonner';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<App/>}>
        
      </Route>
    </>
    
   
  )
)
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster/>
    <RouterProvider router={router}/>
  </Provider>,
)
