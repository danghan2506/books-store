import jwt from "jsonwebtoken"
import asyncHandler from "./async-handler.js"
import dotenv from "dotenv"
import User from "../models/users-model.js"
dotenv.config()
const authenticate = asyncHandler(async(req, res, next) => {
    var token
    token = req.cookies.jwt
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = await User.findById(decoded.userId).select("-password")
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized.Token failed")
        }
    }else{
        res.status(401)
            throw new Error("Not authorized.No token")
    }
} )
// Check if the users is admin or not 
const authorizedAdmin = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next()
    }
    else{
        res.status(401).send("Not authorized as an admin.")
    }
}
export {authenticate, authorizedAdmin}