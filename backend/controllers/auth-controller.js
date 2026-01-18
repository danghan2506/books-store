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
    res.json({message: VALIDATION_MESSAGES.OTP_SEND_SUCCESS})
  }
  catch (error) {
    res.status(500).json({ message: error.message });
}
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!otpStore[email]) {
            return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_NOT_FOUND });
        }
        const { otp: storedOtp, expires } = otpStore[email];
        if (Date.now() > expires) {
            delete otpStore[email];
            return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_EXPIRED });
        }
        if (storedOtp !== otp) {
            return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_NOT_MATCH });
        }
        res.json({ message: VALIDATION_MESSAGES.OTP_VALID });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    // Validate inputs
    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: VALIDATION_MESSAGES.REQUIRED_FIELD });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: VALIDATION_MESSAGES.EMAIL_INVALID });
    }
    try {
        if (!otpStore[email]) {
            return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_INVALID });
        }
        if (newPassword !== confirmPassword) {
            res.status(400);
            throw new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        delete otpStore[email];
        res.json({ message: VALIDATION_MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch (error) {
        // Log error stack for debugging
        console.error("[ERROR]", error);
        res.status(500).json({ message: error.message });
    }
}
const forgotPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: VALIDATION_MESSAGES.REQUIRED_FIELD });
    }
    const user = await User.findOne({email: email})
    if(!user){
        return res.status(404).jsocn({message: VALIDATION_MESSAGES.EMAIL_INVALID})
    }
    try {
        if (!otpStore[email]) {
            return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_INVALID });
        }
        if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
    }
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        delete otpStore[email];
        res.json({ message: VALIDATION_MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export {requestPasswordReset, verifyOtp, resetPassword}