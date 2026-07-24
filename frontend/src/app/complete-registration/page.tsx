import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { CompleteRegistration } from "@/components/auth/complete-registration";

export default function CompleteRegistrationPage() {
  return (
    <AuthLayout
      title="Hoàn tất đăng ký"
      subtitle="Hệ thống đang tạo hồ sơ và phân quyền cho tài khoản."
    >
      <Suspense fallback={<p>Đang tải...</p>}>
        <CompleteRegistration />
      </Suspense>
    </AuthLayout>
  );
}
