"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { bootstrapProfile, dashboardPathForRoles } from "@/lib/auth-api";
import type { PublicSignupRole } from "@/types/auth";

function parseRole(value: string | null): PublicSignupRole | null {
  return value === "CANDIDATE" || value === "RECRUITER" ? value : null;
}

export function CompleteRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState("");
  const role = parseRole(searchParams.get("role"));

  React.useEffect(() => {
    let isActive = true;

    const complete = async () => {
      if (!role) {
        setErrorMessage("Loại tài khoản không hợp lệ.");
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        const profile = await bootstrapProfile(session.access_token, role);
        if (!isActive) return;

        router.replace(dashboardPathForRoles(profile.roles));
        router.refresh();
      } catch (error) {
        if (!isActive) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể hoàn tất đăng ký.",
        );
      }
    };

    void complete();
    return () => {
      isActive = false;
    };
  }, [role, router]);

  if (errorMessage) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-md bg-red-50 p-3 text-sm text-destructive">
          {errorMessage}
        </p>
        <Button asChild>
          <Link href="/register">Chọn lại loại tài khoản</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      Đang thiết lập hồ sơ của bạn...
    </div>
  );
}
