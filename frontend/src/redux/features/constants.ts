const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
export { BASE_URL }
export const USERS_URL = "/api/users"
export const BOOKS_URL = "/api/books"
export const ORDERS_URL ="/api/orders"
export const AUTH_URL = "/api/auth"
export const PAYPAL_URL = "/api/config/paypal"