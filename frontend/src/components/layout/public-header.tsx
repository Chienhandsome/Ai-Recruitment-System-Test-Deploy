"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight text-primary">
                SmartRecruit AI
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Việc làm
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Phòng ban
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Về chúng tôi
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted hover:text-primary"
            >
              Trang chủ
            </Link>
            <Link
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
            >
              Việc làm
            </Link>
            <Link
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
            >
              Phòng ban
            </Link>
          </div>
          <div className="border-t border-muted pb-4 pt-4 px-4 space-y-3">
            <Button variant="outline" className="w-full justify-center" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button className="w-full justify-center" asChild>
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
