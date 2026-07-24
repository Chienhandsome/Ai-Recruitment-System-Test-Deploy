import { AuthLayout } from "@/components/auth/auth-layout";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <AuthLayout
      title="Đặt mật khẩu mới"
      subtitle="Mật khẩu mới phải có ít nhất 8 ký tự."
    >
      <UpdatePasswordForm />
    </AuthLayout>
  );
}
