import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, default: ""},
    addressBook: {
        city: {type: String, default: ""},
        district: {type: String, default: ""},
        country: {type: String, default: ""},
        address: {type: String, default: ""},
    },
    role: {type: String, default: "user"}
}, {timeStamps: true})

const User = mongoose.model("User", userSchema)
export default User