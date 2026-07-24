import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import {
  bootstrapProfile,
  dashboardPathForRoles,
} from "@/lib/auth-api";
import { createClient } from "@/lib/supabase/server";

const supportedTypes = new Set<EmailOtpType>([
  "invite",
  "recovery",
  "email_change",
  "email",
]);

function parseType(value: string | null): EmailOtpType | null {
  return value && supportedTypes.has(value as EmailOtpType)
    ? (value as EmailOtpType)
    : null;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = parseType(request.nextUrl.searchParams.get("type"));

  if (!tokenHash || !type) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Liên kết xác thực không hợp lệ.");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) throw error;
    if (!data.session) {
      throw new Error("Không thể tạo phiên đăng nhập từ liên kết xác thực.");
    }

    if (type === "recovery") {
      return NextResponse.redirect(new URL("/update-password", request.url));
    }

    const profile = await bootstrapProfile(data.session.access_token);
    return NextResponse.redirect(
      new URL(dashboardPathForRoles(profile.roles), request.url),
    );
  } catch (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "error",
      error instanceof Error
        ? error.message
        : "Không thể xác thực liên kết.",
    );
    return NextResponse.redirect(loginUrl);
  }
}
