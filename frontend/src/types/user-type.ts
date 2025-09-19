export interface UserInterface {
    _id: string,
    username: string,
    email: string,
    password?: string
    phoneNumber: string
    addressBook: {
    address: string;
    city: string;
    country: string;
    district: string;
  };
    role: "user" | "admin"
}
export interface LoginRequest {
    email: string,
    password: string
}