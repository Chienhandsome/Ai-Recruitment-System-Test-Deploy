import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận đường dẫn đặt lại mật khẩu."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
