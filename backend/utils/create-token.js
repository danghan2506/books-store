import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const generateToken = (res, userId) => {
    // create JWT token 
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })
// Send token to client as cookie named jwt 
    res.cookie('jwt', token, {
        // only access by server
        httpOnly: true,
        // cookie only send through HTTPS if not development env
        secure: process.env.NODE_ENV !== "development",
        // avdoi CSRF
        sameSite: "strict",
        // time to live
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return token
}
export default generateToken