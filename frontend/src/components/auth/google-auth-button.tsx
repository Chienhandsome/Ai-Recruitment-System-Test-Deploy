"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { PublicSignupRole } from "@/types/auth";

interface GoogleAuthButtonProps {
  role?: PublicSignupRole;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export function GoogleAuthButton({
  role,
  disabled,
  onError,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    onError?.("");

    try {
      const supabase = createClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (role) callbackUrl.searchParams.set("intent", role);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) throw error;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể bắt đầu đăng nhập Google.";
      onError?.(message);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={disabled || isLoading}
      onClick={handleGoogleAuth}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600"
        >
          G
        </span>
      )}
      Tiếp tục với Google
    </Button>
  );
}
