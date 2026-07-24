import { AccountTypeSelector } from "@/components/auth/account-type-selector";
import { AuthLayout } from "@/components/auth/auth-layout";

interface RegisterPageProps {
  searchParams: Promise<{ complete?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const completeExistingAuth = params.complete === "1";

  return (
    <AuthLayout
      title={
        completeExistingAuth
          ? "Hoàn tất tài khoản"
          : "Bạn muốn sử dụng hệ thống như thế nào?"
      }
      subtitle="Chọn đúng loại tài khoản để chúng tôi thiết lập trải nghiệm phù hợp."
    >
      <AccountTypeSelector completeExistingAuth={completeExistingAuth} />
    </AuthLayout>
  );
}
