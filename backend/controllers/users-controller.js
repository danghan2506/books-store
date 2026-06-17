import asyncHandler from "../middlewares/async-handler.js";
import User from "../models/users-model.js";
import AuthToken from "../models/auth-token-model.js";
import { VALIDATION_MESSAGES } from "../constants/validation-messages.js";
import bcrypt from "bcryptjs";
const changeUserPassword = asyncHandler(async (user, currentPassword, newPassword, confirmPassword) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    const err = new Error(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
    err.status = 400;
    throw err;
  }
  const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordCorrect) {
    const err = new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
    err.status = 401;
    throw err;
  }
  if (newPassword !== confirmPassword) {
    const err = new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
    err.status = 400;
    throw err;
  }
  const isNewSameAsOld = await bcrypt.compare(newPassword, user.password);
  if (isNewSameAsOld) {
    const err = new Error(VALIDATION_MESSAGES.PASSWORD_SAME_AS_OLD);
    err.status = 400;
    throw err;
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  return true;
});
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({}).select("-password -refreshToken");
  res.json(allUsers);
});
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      addressBook: {
        city: user.addressBook.city, 
        district: user.addressBook.district, 
        country: user.addressBook.country, 
        address: user.addressBook.address, 
      },
    });
  } else {
    res.status(401);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const {username,email,phoneNumber,role,addressBook,currentPassword,newPassword,confirmPassword} = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: VALIDATION_MESSAGES.EMAIL_EXIST,
      });
    }
  }
  if (role && !["user", "admin"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.INVALID_ROLE,
    });
  }
  let passwordChanged = false;
  const isPasswordUpdateRequested =
    currentPassword !== undefined ||
    newPassword !== undefined ||
    confirmPassword !== undefined;
  if (isPasswordUpdateRequested) {
    try {
      await changeUserPassword(user, currentPassword, newPassword, confirmPassword);
      passwordChanged = true;
    } catch (err) {
      res.status(err.status || 400);
      throw err;
    }
  }
  try {
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (role) user.role = role;
    if (addressBook) {
      Object.keys(addressBook).forEach((key) => {
        if (addressBook[key] !== undefined) {
          user.addressBook[key] = addressBook[key];
        }
      });
      user.markModified("addressBook");
    }

    const updatedUser = await user.save();

    // Đổi mật khẩu -> thu hồi mọi phiên của user bị sửa để buộc đăng nhập lại.
    // KHÔNG xoá cookie ở đây: cookie trong request thuộc về admin đang gọi, không phải user mục tiêu.
    if (passwordChanged) {
      await AuthToken.deleteMany({ user: user._id, type: "refresh" });
      return res.status(200).json({
        message: VALIDATION_MESSAGES.PASSWORD_UPDATED,
        loggedOut: true,
      });
    }
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      addressBook: updatedUser.addressBook,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    res.status(500);
    throw new Error(VALIDATION_MESSAGES.SERVER_ERROR);
  }
});
// Cập nhật hồ sơ của CHÍNH user đang đăng nhập (route /profile).
// Tách hẳn khỏi handler admin: KHÔNG nhận `role` -> không có đường leo thang quyền.
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, addressBook, currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
  // Đổi email: chỉ kiểm tra trùng khi thực sự thay đổi, loại trừ chính mình
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: VALIDATION_MESSAGES.EMAIL_EXIST,
      });
    }
  }
  let passwordChanged = false;
  const isPasswordUpdateRequested =
    currentPassword !== undefined ||
    newPassword !== undefined ||
    confirmPassword !== undefined;
  if (isPasswordUpdateRequested) {
    try {
      await changeUserPassword(user, currentPassword, newPassword, confirmPassword);
      passwordChanged = true;
    } catch (err) {
      res.status(err.status || 400);
      throw err;
    }
  }
  if (username) user.username = username;
  if (email) user.email = email;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  // Chỉ cho cập nhật các field địa chỉ đã định nghĩa sẵn -> chặn inject key lạ
  if (addressBook && typeof addressBook === "object" && !Array.isArray(addressBook)) {
    Object.keys(addressBook).forEach((key) => {
      if (addressBook[key] !== undefined && user.addressBook[key] !== undefined) {
        user.addressBook[key] = addressBook[key];
      }
    });
    user.markModified("addressBook");
  }
  const updatedUser = await user.save();

  // Đổi mật khẩu -> thu hồi mọi phiên (refresh token) và xoá đúng cookie để buộc đăng nhập lại
  if (passwordChanged) {
    await AuthToken.deleteMany({ user: user._id, type: "refresh" });
    const isProduction = process.env.NODE_ENV === "production";
    const expiredCookie = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      expires: new Date(0),
    };
    res.cookie("accessToken", "", expiredCookie);
    res.cookie("refreshToken", "", expiredCookie);
    return res.status(200).json({
      message: VALIDATION_MESSAGES.PASSWORD_UPDATED,
      loggedOut: true,
    });
  }
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    role: updatedUser.role,
    addressBook: updatedUser.addressBook,
    updatedAt: updatedUser.updatedAt,
  });
});
const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Can't delete admin!");
  } else {
    await User.deleteOne({ _id: user._id });
    res.json(VALIDATION_MESSAGES.USER_DELETED);
  }
});
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
});

const getUserStats = asyncHandler(async (req, res) => {
  const now = new Date();
  
  // Start of this week (Monday)
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
  startOfThisWeek.setHours(0, 0, 0, 0);

  // Start of last week
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
  
  const thisWeekUsersData = await User.countDocuments({
    createdAt: { $gte: startOfThisWeek }
  });
  
  const lastWeekUsersData = await User.countDocuments({
    createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek }
  });

  let percentage = 0;
  if (lastWeekUsersData > 0) {
    percentage = ((thisWeekUsersData - lastWeekUsersData) / lastWeekUsersData) * 100;
  } else if (thisWeekUsersData > 0) {
    percentage = 100; // infinite actually but 100% makes sense visually 
  }

  res.json({
    totalNewUsers: thisWeekUsersData,
    percentage: parseFloat(percentage.toFixed(2)),
  });
});

export {
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserProfile,
  getUserById,
  deleteUserProfile,
  getUserStats,
};
