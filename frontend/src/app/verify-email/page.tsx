import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Xác minh email"
      subtitle="Mã OTP có thời hạn và chỉ có thể sử dụng một lần."
    >
      <Suspense fallback={<p>Đang tải...</p>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
