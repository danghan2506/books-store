import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const generateToken = async (res, user) => {
    // 1. Generate Access Token (15 mins)
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
    )

    // 2. Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )

    // 3. Save Refresh Token to database
    user.refreshToken = refreshToken
    await user.save()

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
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return { accessToken, refreshToken }
}

export default generateToken