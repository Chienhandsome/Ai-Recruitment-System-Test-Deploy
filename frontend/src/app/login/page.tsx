import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Nhập email và mật khẩu của bạn để truy cập hệ thống"
    >
      <LoginForm initialError={error} />
    </AuthLayout>
  )
}
