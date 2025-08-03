import type { Book, Images } from "./books-type"
import type { UserInterface } from "./user-type"
export interface CartState {
    cartItems: OrderItems[]
    itemsPrice: number
    shippingPrice: number;
    taxPrice: number;
    totalPrice: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
}
export interface Order {
    user: UserInterface
    _id: string
    orderItems: OrderItems
    shippingAddress: ShippingAddress
    paymentMethod: PaymentResult
    itemsPrice: number
    taxPrice: number
    shippingPrice: number
    totalPrice: number
    isDelivered: boolean
    deliveredAt: Date
    isPaid: boolean
    paidAt: Date
}
export interface OrderItems {
    name: string
    _id: string
    images: Images[]
    quantity: number
    price: number
    brand?: string
    stock?: number
    category?: {
        categoryName: string
        categorySlug: string
    }
}
export interface ShippingAddress {
    country: string
    city: string
    phoneNumber: string
    district: string
    address: string
}
export interface PaymentResult {
    id: string
    status: string
    update_time: Date
    email_address: string
}
