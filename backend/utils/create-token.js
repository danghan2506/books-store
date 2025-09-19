import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const generateToken = (res, userId) => {
    // create JWT token 
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })
// Send token to client as cookie named jwt 
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return token
}
export default generateToken