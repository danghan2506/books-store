export interface UserInterface {
    _id: string,
    name: string,
    email: string,
    role: "user" | "admin"
}
export interface LoginRequest {
    email: string,
    password: string
}