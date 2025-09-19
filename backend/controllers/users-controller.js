import asyncHandler from "../middlewares/async-handler.js";
import User from "../models/users-model.js";
import { VALIDATION_MESSAGES } from "../constants/validation-messages.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/create-token.js";
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
        city: user.addressBook.city, // FIX: Changed from newUser to user
        district: user.addressBook.district, // FIX: Changed from newUser to user
        country: user.addressBook.country, // FIX: Changed from newUser to user
        address: user.addressBook.address, // FIX: Changed from newUser to user
      },
    });
  } else {
    res.status(401);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const {
    username,
    email,
    phoneNumber,
    role,
    addressBook,
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }

  // CRITICAL validations only (security & data integrity)

  // 1. Email uniqueness (MUST validate - data integrity)
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  // 2. Role validation (MUST validate - security)
  if (role && !["user", "admin"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  }

  // 3. Password update flow (MUST validate + hash)
  let passwordChanged = false;
  const isPasswordUpdateRequested =
    currentPassword !== undefined || newPassword !== undefined || confirmPassword !== undefined;

  if (isPasswordUpdateRequested) {
    // Ensure all required fields are present
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400);
      throw new Error(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
    }

    // Validate current password correctness
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      res.status(401);
      throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
    }

    // Validate new password confirmation
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
    }

    // Ensure new password is different from current
    const isNewSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isNewSameAsOld) {
      res.status(400);
      throw new Error("New password must be different from current password");
    }

    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    passwordChanged = true;
  }
  try {
    // Update fields (let Mongoose schema handle basic validation)
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (role) user.role = role;

    // Update addressBook
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
      return res.status(200).json({ message: VALIDATION_MESSAGES.PASSWORD_UPDATED, loggedOut: true });
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
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      res.status(400);
      throw new Error("Invalid data provided");
    }

    if (error.code === 11000) {
      res.status(400);
      throw new Error("Email already exists");
    }

    res.status(500);
    throw new Error("Server error");
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
  createUser,
  login,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateUserProfile,
  getUserById,
  deleteUserProfile,
};
