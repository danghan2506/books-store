import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import AuthToken from "../models/auth-token-model.js"
import hashToken from "./hash-token.js"
dotenv.config()

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const generateToken = async (res, user) => {
    // 1. Generate Access Token (currently 1m, refreshed transparently by the client)
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1m" }
    )

    // 2. Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )

    // 3. Lưu refresh token (đã hash) vào collection AuthToken.
    //    Mỗi lần đăng nhập tạo 1 phiên riêng -> hỗ trợ nhiều thiết bị.
    //    Doc tự hết hạn nhờ TTL index trên expiresAt.
    await AuthToken.create({
        user: user._id,
        type: "refresh",
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    })

    // 4. Send cookies to client
    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: REFRESH_TOKEN_TTL_MS // 7 days
    })

    return { accessToken, refreshToken }
}

export default generateToken
