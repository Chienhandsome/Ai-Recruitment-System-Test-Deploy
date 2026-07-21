import * as React from "react"
import Link from "next/link"
import { BrainCircuit } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <BrainCircuit className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold tracking-tight">SmartRecruit AI</span>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Khám phá cơ hội nghề nghiệp với sức mạnh của AI
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Hệ thống phân tích và đánh giá tự động giúp bạn tìm được công việc phù hợp nhất với năng lực.
          </p>
        </div>
        <div className="text-primary-foreground/60 text-sm">
          &copy; {new Date().getFullYear()} SmartRecruit AI. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 bg-surface">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-primary">SmartRecruit AI</span>
          </Link>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}
