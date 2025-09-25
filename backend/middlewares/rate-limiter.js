import ratelimiter from "express-rate-limit"
const apiLimiter = ratelimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too much API request from this IP, please try again after 15 minutes!",
    standardHeaders: true,
    legacyHeaders: false
})
export {apiLimiter}