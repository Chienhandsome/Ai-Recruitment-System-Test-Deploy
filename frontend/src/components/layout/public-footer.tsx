import * as React from "react"
import Link from "next/link"
import { BrainCircuit } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight text-primary">
                SmartRecruit AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Nền tảng tuyển dụng thông minh ứng dụng AI giúp tối ưu hóa quy trình tìm kiếm và đánh giá ứng viên.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Dành cho ứng viên</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Tìm việc làm</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Tạo CV bằng AI</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Cẩm nang nghề nghiệp</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Dành cho Nhà tuyển dụng</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Đăng tin tuyển dụng</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Tìm kiếm hồ sơ</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Bảng giá dịch vụ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Email: contact@smartrecruit.ai</li>
              <li className="text-sm text-muted-foreground">Hotline: 1900 xxxx</li>
              <li className="text-sm text-muted-foreground">Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SmartRecruit AI. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Điều khoản sử dụng</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
