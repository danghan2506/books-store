import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import {store} from "./redux/features/store.ts"
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Login from './pages/auth/login-form.tsx'
import { RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import { Toaster } from 'sonner';
import Cart from './pages/shop/cart.tsx';
import Shop from './pages/shop/shop.tsx';
import Home from './pages/shop/home.tsx';
import BookDetails from './pages/shop/book-details.tsx';
import Favourite from './pages/shop/favourites.tsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<App/>}>
        <Route index element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/favourite' element={<Favourite/>}></Route>
        <Route path='shop/:id' element={<BookDetails/>}/>
      </Route >
    </>
    
   
  )
)
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position="top-right"
        richColors
        closeButton/>
    <RouterProvider router={router}/>
  </Provider>,
)
