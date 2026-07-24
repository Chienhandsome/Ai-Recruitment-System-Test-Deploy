import { DashboardShell } from "@/components/auth/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/server-profile";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const profile = await requireProfile("ADMIN");

  return (
    <DashboardShell title="Admin Dashboard" fullName={profile.fullName}>
      <Card>
        <CardHeader>
          <CardTitle>Quản trị hệ thống</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Tài khoản này được tạo qua quy trình bootstrap ADMIN bảo mật.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
