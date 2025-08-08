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
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>;

