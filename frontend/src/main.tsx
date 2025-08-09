import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/features/store.ts";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "./pages/auth/login-form.tsx";
import { RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "sonner";
import Cart from "./pages/shop/cart.tsx";
import Shop from "./pages/shop/shop.tsx";
import Home from "./pages/shop/home.tsx";
import BookDetails from "./pages/shop/book-details.tsx";
import Favourite from "./pages/shop/favourites.tsx";
import PlaceOrders from "./pages/shop/place-order.tsx";
import ShippingForm from "./pages/shop/shipping-form.tsx";
import PrivateRoutes from "./pages/private-routes.tsx";
import OrderSummary from "./pages/shop/order-summary.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AdminDashBoard from "./pages/admin/admin-dashboard.tsx";
import UsersList from "./pages/admin/users-list.tsx";
import AdminLayout from "./AdminLayout.tsx";
import SignupForm from "./pages/auth/signup-form.tsx";
import BooksList from "./pages/admin/books-list.tsx";
import BooksForm from "./pages/admin/books-form.tsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm/>}/>
      <Route path="/" element={<App />}>
        {/* User routes */}
        <Route path="" element={<PrivateRoutes />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/favourite" element={<Favourite />}></Route>
          <Route path="/place-orders" element={<PlaceOrders />} />
          <Route path="/shipping-address" element={<ShippingForm />} />
          <Route path="/order/:orderId" element={<OrderSummary />} />
        </Route>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="shop/:id" element={<BookDetails />} />
        {/* Admin routes */}
        <Route path="admin" element={<AdminLayout/>}>
          <Route index element={<AdminDashBoard />} /> {/* /admin */}
          <Route path="users-list" element={<UsersList />} />
          <Route path="books-list" element={<BooksList/>}/>
          <Route path="create-books" element={<BooksForm/>}/>
          {/* /admin/users-list */}
        </Route>
      </Route>
    </>
  )
);
const initialPayPalOptions = {
  clientId: "test",
  currency: "USD",
  intent: "capture",
};
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster position="top-right" richColors closeButton />
    <PayPalScriptProvider options={initialPayPalOptions}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
