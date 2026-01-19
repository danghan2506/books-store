export const VALIDATION_MESSAGES = {
  _VERSION: "1.0.0",
  // Required fields
  REQUIRED_FIELD: "This field is required",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  USERNAME_REQUIRED: "Username is required",
  PHONE_REQUIRED: "Phone number is required",
  
  // Format validation
  EMAIL_INVALID: "Please enter a valid email address",
  PHONE_INVALID: "Please enter a valid phone number",
  EMAIL_EXIST: "Email already exists",
  
  // Password validation
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_WEAK: "Password must contain uppercase, lowercase, number and special character",
  PASSWORD_MAX_LENGTH: "Password cannot exceed 128 characters",
  PASSWORD_MISMATCH: "Passwords do not match",
  PASSWORD_SAME_AS_OLD: "New password must be different from current password",
  
  // Username validation
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters",
  USERNAME_MAX_LENGTH: "Username cannot exceed 20 characters",
  USERNAME_INVALID_CHARS: "Username can only contain letters, numbers and underscore",
  
  // Business logic
  USER_ALREADY_EXISTS: "User with this email already exists",
  USERNAME_TAKEN: "Username is already taken",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  OTP_INVALID: "OTP is not valid",
  OTP_NOT_FOUND: "OTP has not been requested or OTP has expired",
  OTP_EXPIRED: "OTP has expired",
  OTP_NOT_MATCH: "OTP does not match",
  INVALID_ROLE: "Role must be user or admin",
  UNAUTHORIZED: "You are not authorized to perform this action",
  FIREBASE_TOKEN_MISSING: "Firebase token is missing",
  FIREBASE_TOKEN_INVALID: "Firebase token is invalid",
  // Server errors
  SERVER_ERROR: "Something went wrong. Please try again later",
  VALIDATION_ERROR: "Please check your input and try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  
  // Success messages
  USER_CREATED: "Account created successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  USER_DELETED: "Deleted user's profile successfully", 
  PASSWORD_UPDATED: "Password updated successfully",
  BOOK_DELETED_SUCCESSFULLY:  "Book and associated images deleted successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  OTP_SEND_SUCCESS: "OTP has been send to your email.",
  OTP_VALID: "OTP is valid",
};