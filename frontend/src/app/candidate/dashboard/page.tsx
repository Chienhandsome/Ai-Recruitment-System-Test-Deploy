import { DashboardShell } from "@/components/auth/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/server-profile";

export const dynamic = "force-dynamic";

export default async function CandidateDashboardPage() {
  const profile = await requireProfile("CANDIDATE");

  return (
    <DashboardShell
      title="Candidate Dashboard"
      fullName={profile.fullName}
    >
      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ ứng viên đã sẵn sàng</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Tài khoản đã được xác thực và gán role Candidate.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
