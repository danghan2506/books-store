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
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
      .regex(/[@$!%*?&]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(8, "Nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải ít nhất 8 ký tự")
})
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>;

