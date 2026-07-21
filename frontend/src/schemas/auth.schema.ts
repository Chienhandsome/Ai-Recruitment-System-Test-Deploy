import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  rememberMe: z.boolean().default(false).optional(),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Họ tên không được để trống"),
    email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });
