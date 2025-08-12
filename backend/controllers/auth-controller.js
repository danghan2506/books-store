import User from "../models/users-model.js";
import nodemailer from "nodemailer"
import { VALIDATION_MESSAGES } from "../constants/validation-messages.js";
import bcrypt from "bcryptjs";
let otpStore = {}
const requestPasswordReset = async (req, res) => {
  try{
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
      return res.status(404).json(VALIDATION_MESSAGES.EMAIL_INVALID)
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP reset password",
      text: `Your OTP is: ${otp}, it will expire in 5 minutes`
    })
    res.json({message: "OTP has been send to your email."})
  }
  catch (error) {
    res.status(500).json({ message: VALIDATION_MESSAGES.INVALID_CREDENTIALS });
}
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!otpStore[email]) {
            return res.status(400).json({ message: "Chưa yêu cầu OTP hoặc OTP đã hết hạn" });
        }
        const { otp: storedOtp, expires } = otpStore[email];
        if (Date.now() > expires) {
            delete otpStore[email];
            return res.status(400).json({ message: "OTP đã hết hạn" });
        }
        if (storedOtp !== otp) {
            return res.status(400).json({ message: "OTP không chính xác" });
        }
        res.json({ message: "OTP hợp lệ" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const resetPassword = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!otpStore[email]) {
            return res.status(400).json({ message: "OTP chưa được xác thực" });
        }
        if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
    }
    const isNewSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewSameAsOld) {
          res.status(400);
          throw new Error("New password must be different from current password");
        }
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        // Xóa OTP sau khi đổi mật khẩu
        delete otpStore[email];
        res.json({ message: "Mật khẩu đã được thay đổi thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export {requestPasswordReset, verifyOtp, resetPassword}