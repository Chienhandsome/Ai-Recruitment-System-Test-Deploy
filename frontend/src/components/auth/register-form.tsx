"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { registerSchema } from "@/schemas/auth.schema"
import type { RegisterFormValues } from "@/types/auth"

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  // Watch checkbox to trigger re-render on state change for validation styling
  const acceptTerms = watch("acceptTerms")

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    // Mock API call
    console.log("Register values:", values)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Đăng ký thành công!</h3>
        <p className="text-muted-foreground">
          Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để bắt đầu trải nghiệm.
        </p>
        <Button className="w-full" asChild>
          <Link href="/login">Đến trang đăng nhập</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          placeholder="Nguyễn Văn A"
          {...register("fullName")}
          className={errors.fullName ? "border-destructive focus-visible:ring-destructive/20" : ""}
          disabled={isLoading}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

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
        <Label htmlFor="password">Mật khẩu</Label>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20 pr-10" : "pr-10"}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle confirm password visibility</span>
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="acceptTerms" 
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue("acceptTerms", checked === true, { shouldValidate: true })}
            disabled={isLoading} 
          />
          <Label
            htmlFor="acceptTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-1"
          >
            Tôi đồng ý với{" "}
            <Link href="#" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="#" className="text-primary hover:underline">
              Chính sách bảo mật
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Đăng ký tài khoản
      </Button>

      <div className="text-center text-sm">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  )
}
