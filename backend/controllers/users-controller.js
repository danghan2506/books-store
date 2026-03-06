import asyncHandler from "../middlewares/async-handler.js";
import User from "../models/users-model.js";
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
  const allUsers = await User.find({});
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

    // If password changed, log user out by clearing auth cookie
    if (passwordChanged) {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
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
  const user = await User.findById(userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
});

export {
  getAllUsers,
  getCurrentUserProfile,
  updateUserProfile,
  getUserById,
  deleteUserProfile,
};
