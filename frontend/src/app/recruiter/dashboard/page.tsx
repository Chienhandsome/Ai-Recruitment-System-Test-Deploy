import { DashboardShell } from "@/components/auth/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/server-profile";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboardPage() {
  const profile = await requireProfile("RECRUITER");

  return (
    <DashboardShell
      title="Recruiter Dashboard"
      fullName={profile.fullName}
    >
      <Card>
        <CardHeader>
          <CardTitle>Tài khoản nhà tuyển dụng đã sẵn sàng</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Bạn có thể tiếp tục bổ sung công ty, phòng ban và chức danh trong bước
          xây dựng hồ sơ Recruiter.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
