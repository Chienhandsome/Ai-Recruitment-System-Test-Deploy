import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function CandidateRegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản Candidate"
      subtitle="Xác minh email để bắt đầu tìm kiếm và ứng tuyển công việc."
    >
      <RegisterForm role="CANDIDATE" />
    </AuthLayout>
  );
}
