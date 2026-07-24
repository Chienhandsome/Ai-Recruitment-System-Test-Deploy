import type { ReactNode } from "react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardShellProps {
  title: string;
  fullName: string;
  children: ReactNode;
}

export function DashboardShell({
  title,
  fullName,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-surface">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <BrainCircuit className="h-7 w-7" />
            <span className="font-bold">SmartRecruit AI</span>
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground">Xin chào, {fullName}</p>
        <h1 className="mt-1 text-3xl font-bold">{title}</h1>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
