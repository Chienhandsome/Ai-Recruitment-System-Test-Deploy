import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Đăng ký tài khoản miễn phí để tìm kiếm công việc phù hợp với bạn"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
