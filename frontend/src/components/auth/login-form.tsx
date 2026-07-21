"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { loginSchema } from "@/schemas/auth.schema"
import type { LoginFormValues } from "@/types/auth"

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    // Mock API call
    console.log("Login values:", values)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    alert("Đăng nhập thành công (Mock)")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mật khẩu</Label>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-destructive focus-visible:ring-destructive/20 pr-10" : "pr-10"}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="rememberMe" {...register("rememberMe")} disabled={isLoading} />
        <Label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ghi nhớ đăng nhập
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Đăng nhập
      </Button>

      <div className="text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </form>
  )
}
