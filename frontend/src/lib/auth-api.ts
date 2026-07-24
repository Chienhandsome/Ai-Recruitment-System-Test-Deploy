import type {
  AuthProfile,
  AuthRole,
  PublicSignupRole,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://ai-recruitment-system-test-deploy.onrender.com/api";

interface ApiErrorPayload {
  code?: string;
  message?: string | string[];
  error?: string;
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function authRequest(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<AuthProfile> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let payload: ApiErrorPayload = {};
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      // Fall back to the HTTP status below.
    }

    const rawMessage = payload.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : rawMessage ?? payload.error ?? "Không thể xác thực tài khoản.";

    throw new AuthApiError(message, response.status, payload.code);
  }

  return (await response.json()) as AuthProfile;
}

export function bootstrapProfile(
  accessToken: string,
  role?: PublicSignupRole,
) {
  return authRequest("/auth/bootstrap", accessToken, {
    method: "POST",
    body: JSON.stringify(role ? { role } : {}),
  });
}

export function getCurrentProfile(accessToken: string) {
  return authRequest("/auth/me", accessToken);
}

export function dashboardPathForRoles(roles: AuthRole[]) {
  if (roles.includes("ADMIN")) return "/admin/dashboard";
  if (roles.includes("RECRUITER")) return "/recruiter/dashboard";
  return "/candidate/dashboard";
}
