import User from "../models/users-model.js";
import nodemailer from "nodemailer"
import { VALIDATION_MESSAGES } from "../constants/validation-messages.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/create-token.js";
import admin from "../config/firebase-admin.js";
import asyncHandler from "../middlewares/async-handler.js";
let otpStore = {}
const loginWithGoogle = async (req, res) => {
  try {
    const token = req.body.idToken;
    if (!token) {
      return res.status(401).json(VALIDATION_MESSAGES.FIREBASE_TOKEN_MISSING);
    }
    const decoded = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({
        email: decoded.email,
        firebaseUid: decoded.uid,
        provider: decoded.firebase?.sign_in_provider || "firebase",
        role: "user",
        username: decoded.name || decoded.email,
        phoneNumber: decoded.phone_number || "",
      });
    }
    generateToken(res, user._id)
    return res.json({ message: "Authenticated", user });
  } catch (error) {
    return res.status(401).json(VALIDATION_MESSAGES.FIREBASE_TOKEN_INVALID, error);
  }
};
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  switch (true) {
    case !username:
      throw new Error(VALIDATION_MESSAGES.USERNAME_REQUIRED);
    case !email:
      throw new Error(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    case !password:
      throw new Error(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
  }
  const userExisted = await User.findOne({ email });
  if (userExisted) {
    res.status(400).send(VALIDATION_MESSAGES.USER_ALREADY_EXISTS);
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    generateToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.hashedPassword,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      addressBook: {
        city: newUser.addressBook.city,
        district: newUser.addressBook.district,
        country: newUser.addressBook.country,
        address: newUser.addressBook.address,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(VALIDATION_MESSAGES.SERVER_ERROR);
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  switch (true) {
    case !email:
      throw new Error(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    case !password:
      throw new Error(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(401);
    throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
  }
  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    res.status(401);
    throw new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
  }
  generateToken(res, existingUser._id);
  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    role: existingUser.role,
    phoneNumber: existingUser.phoneNumber,
    addressBook: {
      city: existingUser.addressBook.city,
      district: existingUser.addressBook.district,
      country: existingUser.addressBook.country,
      address: existingUser.addressBook.address,
    },
  });
});
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json(VALIDATION_MESSAGES.LOGOUT_SUCCESS);
});
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
export {requestPasswordReset, verifyOtp, resetPassword, login, loginWithGoogle, logoutCurrentUser, createUser}