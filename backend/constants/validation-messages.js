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
  
  // Password validation
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_WEAK: "Password must contain uppercase, lowercase, number and special character",
  PASSWORD_MAX_LENGTH: "Password cannot exceed 128 characters",
  PASSWORD_MISMATCH: "Passwords do not match",
  
  // Username validation
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters",
  USERNAME_MAX_LENGTH: "Username cannot exceed 20 characters",
  USERNAME_INVALID_CHARS: "Username can only contain letters, numbers and underscore",
  
  // Business logic
  USER_ALREADY_EXISTS: "User with this email already exists",
  USERNAME_TAKEN: "Username is already taken",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  UNAUTHORIZED: "You are not authorized to perform this action",
  
  // Server errors
  SERVER_ERROR: "Something went wrong. Please try again later",
  VALIDATION_ERROR: "Please check your input and try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  
  // Success messages
  USER_CREATED: "Account created successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PASSWORD_UPDATED: "Password updated successfully"
};