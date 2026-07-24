import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RecruiterRegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản Recruiter"
      subtitle="Đăng tin tuyển dụng và quản lý quy trình tuyển chọn ứng viên."
    >
      <RegisterForm role="RECRUITER" />
    </AuthLayout>
  );
}
