import type { PendingSignup } from "@/types/auth";

const PENDING_SIGNUP_KEY = "smart-recruit:pending-signup";

export function savePendingSignup(pendingSignup: PendingSignup) {
  window.sessionStorage.setItem(
    PENDING_SIGNUP_KEY,
    JSON.stringify(pendingSignup),
  );
}

export function readPendingSignup(): PendingSignup | null {
  const rawValue = window.sessionStorage.getItem(PENDING_SIGNUP_KEY);
  if (!rawValue) return null;

  try {
    const value = JSON.parse(rawValue) as Partial<PendingSignup>;
    if (
      typeof value.email === "string" &&
      (value.role === "CANDIDATE" || value.role === "RECRUITER")
    ) {
      return {
        email: value.email,
        role: value.role,
      };
    }
  } catch {
    // Invalid client state is treated as absent.
  }

  return null;
}

export function clearPendingSignup() {
  window.sessionStorage.removeItem(PENDING_SIGNUP_KEY);
}
