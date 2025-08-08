
import asyncHandler from "../middlewares/async-handler.js";
import User from "../models/users-model.js";
import { VALIDATION_MESSAGES } from "../constants/validation-messages.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/create-token.js";
const createUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body
    switch(true){
      case !username: throw new Error(VALIDATION_MESSAGES.USERNAME_REQUIRED)
      case !email: throw new Error(VALIDATION_MESSAGES.EMAIL_REQUIRED)
      case !password: throw new Error(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    }
    const userExisted = await User.findOne({email})
    if(userExisted){
        res.status(400).send(VALIDATION_MESSAGES.USER_ALREADY_EXISTS)
        return
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({username, email, password: hashedPassword})
    try{
        await newUser.save()
        generateToken(res, newUser._id)
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            password: newUser.hashedPassword,
            role: newUser.role,
        })
    }
    catch(error){
        res.status(400)
        throw new Error(VALIDATION_MESSAGES.SERVER_ERROR)
    }
})
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  switch(true){
    case !email : throw new Error(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    case !password: throw new Error(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  }
  const existingUser = await User.findOne({ email });
  if(!existingUser){
    res.status(401);
    throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
  }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
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
        });
});
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json(VALIDATION_MESSAGES.LOGOUT_SUCCESS);
});
const getAllUsers = asyncHandler(async(req, res) => {
    const allUsers = await User.find({})
    res.json(allUsers)
})
const getCurrentUserProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(401);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND)
  }
})
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.userId
  const user = await User.findById(userId);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    if (req.body.role) {
      if (req.body.role === "user" || req.body.role === "admin") {
        user.role = req.body.role;
      } else {
        res.status(400);
        throw new Error(VALIDATION_MESSAGES.INVALID_ROLE);
      }
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
});
const deleteUserProfile = asyncHandler(async(req, res) => {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(user.role === "admin"){
        res.status(400)
        throw new Error("Can't delete admin!")
    }
    else{
        await User.deleteOne({ _id: user._id });
        res.json(VALIDATION_MESSAGES.USER_DELETED);
    }
})
const getUserById = asyncHandler(async(req, res) => {
    const userId = req.params.userId
  const user = await User.findById(userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error(VALIDATION_MESSAGES.USER_NOT_FOUND);
  }
})
export {createUser, login, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateUserProfile, getUserById ,deleteUserProfile}