import User from "../models/users-model.js";
import nodemailer from "nodemailer"
import { VALIDATION_MESSAGES } from "../constants/validation-messages.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/create-token.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import asyncHandler from "../middlewares/async-handler.js";
import jwt from "jsonwebtoken";
import AuthToken from "../models/auth-token-model.js";
import hashToken from "../utils/hash-token.js";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 5;
const loginWithClerk = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    if (!clerkId) {
      return res.status(401).json({ message: "Clerk auth missing" });
    }
    // Fallback explicit configuration in case singleton has empty constructor
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return res.status(400).json({ message: "No email associated with this Clerk account" });
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        email: email,
        clerkId: clerkUser.id,
        provider: "clerk",
        role: "user",
        username: (clerkUser.firstName || "") + " " + (clerkUser.lastName || "") || email,
      });
    } else if (!user.clerkId) {
       user.clerkId = clerkUser.id;
       await user.save();
    }
    await generateToken(res, user)
    return res.json({ message: "Authenticated", user });
  } catch (error) {
    console.error("Clerk login error:", error);
    return res.status(401).json({ message: "Invalid Clerk token", error: error.message });
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
    await generateToken(res, newUser);
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
  await generateToken(res, existingUser);
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
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    // Chỉ thu hồi đúng phiên (thiết bị) hiện tại, không động tới phiên khác
    await AuthToken.deleteOne({
      type: "refresh",
      tokenHash: hashToken(refreshToken),
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.status(200).json(VALIDATION_MESSAGES.LOGOUT_SUCCESS);
});
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(VALIDATION_MESSAGES.EMAIL_INVALID);
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Mỗi user chỉ giữ 1 OTP reset_otp hiện hành: upsert đè OTP cũ, reset attempts/verified
  await AuthToken.findOneAndUpdate(
    { user: user._id, type: "reset_otp" },
    {
      tokenHash: hashToken(otp),
      attempts: 0,
      verified: false,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP reset password",
    text: `Your OTP is: ${otp}, it will expire in 5 minutes`,
  });
  res.json({ message: VALIDATION_MESSAGES.OTP_SEND_SUCCESS });
});
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: VALIDATION_MESSAGES.EMAIL_INVALID });
  }
  // TTL index có thể xoá doc hết hạn -> không tìm thấy = chưa yêu cầu hoặc đã hết hạn
  const record = await AuthToken.findOne({ user: user._id, type: "reset_otp" });
  if (!record) {
    return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_NOT_FOUND });
  }
  if (record.expiresAt.getTime() < Date.now()) {
    await record.deleteOne();
    return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_EXPIRED });
  }
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    await record.deleteOne();
    return res.status(429).json({ message: VALIDATION_MESSAGES.OTP_INVALID });
  }
  if (record.tokenHash !== hashToken(otp)) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_NOT_MATCH });
  }
  // OTP đúng -> đánh dấu verified để bước /reset được phép đổi mật khẩu
  record.verified = true;
  await record.save();
  res.json({ message: VALIDATION_MESSAGES.OTP_VALID });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: VALIDATION_MESSAGES.REQUIRED_FIELD });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: VALIDATION_MESSAGES.EMAIL_INVALID });
  }
  // Chỉ cho đổi mật khẩu khi OTP đã được xác thực và còn hạn
  const record = await AuthToken.findOne({ user: user._id, type: "reset_otp" });
  if (!record || !record.verified || record.expiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: VALIDATION_MESSAGES.OTP_INVALID });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: VALIDATION_MESSAGES.PASSWORD_MISMATCH });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await record.deleteOne(); // OTP dùng một lần
  res.json({ message: VALIDATION_MESSAGES.PASSWORD_RESET_SUCCESS });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.warn("⚠️ Refresh Token request failed: No refreshToken cookie provided");
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.warn("⚠️ Refresh Token failed: User not found in database for ID:", decoded.userId);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Phiên refresh phải còn tồn tại trong AuthToken (chưa logout / chưa hết hạn TTL)
    const session = await AuthToken.findOne({
      user: user._id,
      type: "refresh",
      tokenHash: hashToken(refreshToken),
    });
    if (!session) {
      console.warn(`⚠️ Refresh Token mismatch: no active session for user ${user.email}`);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Generate a new Access Token (15 mins)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    console.log(`✅ Access token successfully refreshed for user: ${user.email}`);
    res.json({ message: "Access token refreshed successfully" });
  } catch (error) {
    console.error("❌ Refresh Token Verification Failed:", error.message);
    res.status(403).json({ message: "Invalid refresh token", error: error.message });
  }
});

export {requestPasswordReset, verifyOtp, resetPassword, login, loginWithClerk, logoutCurrentUser, createUser, refreshAccessToken}