import { z } from "zod";
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, "Tên phải ít nhất 2 ký tự")
      .max(50, "Tên tối đa 50 ký tự")
      .regex(
        /^([a-zA-ZÀ-ỹ]+\s){1,}[a-zA-ZÀ-ỹ]+$/,
        "Tên phải có ít nhất 2 từ, chỉ chứa chữ và khoảng trắng"
      )
      .transform(
        (val) =>
          val
            .trim() // xoá khoảng trắng đầu/cuối
            .replace(/\s+/g, " ") // bỏ khoảng trắng thừa giữa
            .split(" ") // tách từ
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ) // viết hoa chữ đầu
            .join(" ") // ghép lại
      ),
    email: z.string().email("Invalid email!"),
    password: z
      .string()
      .min(8, "Passsword must contain at least 8 characters!")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter!")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter!")
      .regex(/[0-9]/, "Password must contain at least 1 number!")
      .regex(/[@$!%*?&]/, "Password must contain at least 1 special character"),
    confirmPassword: z.string().min(8, "Password do not match!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
export const loginSchema = z.object({
    email: z.string().email("Invalid email!"),
    password: z.string().min(8, "Password must contain at least 8 character!")
})
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "Passsword must contain at least 8 characters!")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter!")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter!")
      .regex(/[0-9]/, "Password must contain at least 1 number!")
      .regex(/[@$!%*?&]/, "Password must contain at least 1 special character"),
    confirmPassword: z.string().min(8, "Password do not match!"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match!",
  })
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      "Username can only contain letters and spaces"
    )
    .refine(
      (val) => val.trim().split(/\s+/).length >= 2,
      "Username must have at least 2 words"
    )
    .transform((val) =>
      val
        .trim() // remove leading/trailing spaces
        .replace(/\s+/g, " ") // remove extra spaces between words
        .split(" ") // split into words
        .map((word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // capitalize first letter of each word
        .join(" ") // join back
    ),
    
  email: z
    .string()
    .email("Invalid email format!")
    .min(1, "Email is required"),
    
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(0[3|5|7|8|9])+([0-9]{8})$/,
      "Invalid Vietnamese phone number format (e.g., 0332586011)"
    ),
    
  addressBook: z.object({
    city: z
      .string()
      .min(2, "City name must be at least 2 characters")
      .max(50, "City name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        "City name can only contain letters and spaces"
      )
      .transform((val) =>
        val
          .trim()
          .replace(/\s+/g, " ")
          .split(" ")
          .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      ),
      
    district: z
      .string()
      .min(2, "District name must be at least 2 characters")
      .max(50, "District name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        "District name can only contain letters and spaces"
      )
      .transform((val) =>
        val
          .trim()
          .replace(/\s+/g, " ")
          .split(" ")
          .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      ),
      
    country: z
      .string()
      .min(2, "Country name must be at least 2 characters")
      .max(50, "Country name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        "Country name can only contain letters and spaces"
      )
      .transform((val) =>
        val
          .trim()
          .replace(/\s+/g, " ")
          .split(" ")
          .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      ),
      
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be at most 200 characters")
      .regex(
        /^[a-zA-ZÀ-ỹ0-9\s,.-]+$/,
        "Address can only contain letters, numbers, spaces, and characters: , . -"
      )
      .transform((val) =>
        val
          .trim()
          .replace(/\s+/g, " ")
      ),
  }),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>

