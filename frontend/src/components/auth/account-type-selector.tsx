import Link from "next/link";
import { BriefcaseBusiness, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountTypeSelectorProps {
  completeExistingAuth?: boolean;
}

export function AccountTypeSelector({
  completeExistingAuth = false,
}: AccountTypeSelectorProps) {
  const candidateHref = completeExistingAuth
    ? "/complete-registration?role=CANDIDATE"
    : "/register/candidate";
  const recruiterHref = completeExistingAuth
    ? "/complete-registration?role=RECRUITER"
    : "/register/recruiter";

  return (
    <div className="grid gap-4">
      <Link href={candidateHref} className="group">
        <Card className="transition hover:border-primary hover:shadow-md">
          <CardHeader className="flex-row items-center gap-4">
            <div className="rounded-lg bg-secondary p-3 text-primary">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Tìm công việc phù hợp</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Tạo tài khoản Candidate để ứng tuyển và quản lý hồ sơ.
              </p>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={recruiterHref} className="group">
        <Card className="transition hover:border-primary hover:shadow-md">
          <CardHeader className="flex-row items-center gap-4">
            <div className="rounded-lg bg-secondary p-3 text-primary">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Đăng tin tuyển dụng</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Tạo tài khoản Recruiter để quản lý tin tuyển dụng và ứng viên.
              </p>
            </div>
          </CardHeader>
        </Card>
      </Link>

      {completeExistingAuth && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6 text-sm text-blue-800">
            Google đã xác thực email của bạn. Chọn loại tài khoản để hoàn tất
            đăng ký; lựa chọn này không thể tự thay đổi sau đó.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
