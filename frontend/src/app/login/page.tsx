import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Nhập email và mật khẩu của bạn để truy cập hệ thống"
    >
      <LoginForm />
    </AuthLayout>
  )
}
