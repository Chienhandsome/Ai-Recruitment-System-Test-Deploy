# Supabase Auth - Hướng dẫn cấu hình và vận hành

Source code cho Email/Password + OTP, Google OAuth và phân quyền đã được tích hợp. Các bước dưới đây cần thực hiện trên Supabase/Google Dashboard để kích hoạt luồng thực tế.

## 1. Chạy migration

Từ thư mục `backend`:

```powershell
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
```

Nếu script `prisma:seed` chưa được khai báo, chạy:

```powershell
npx prisma db seed
```

Nếu máy deploy không kết nối được direct host của Supabase do IPv6, đặt
`DIRECT_URL` thành **Session Pooler URL (port 5432)**. Không dùng Transaction
Pooler port `6543` để chạy migration.

Migration sẽ:

- Xóa `public.users.password_hash`.
- Chuyển user ID và các foreign key liên quan sang UUID.
- Liên kết `public.users.id` với `auth.users.id`.
- Chuẩn hóa account status.

## 2. Frontend environment variables

Khai báo trong local `.env.local` và Vercel:

```env
NEXT_PUBLIC_API_URL=https://ai-recruitment-system-test-deploy.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://ai-recruitment-system-test-deploy-1.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Publishable key được phép dùng ở frontend. Không đưa Supabase secret key vào Vercel frontend.

## 3. Backend environment variables

Khai báo trên backend hosting:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SECRET_KEY=<secret-key>
DATABASE_URL=<transaction-pooler-url>
DIRECT_URL=<direct-database-url>
CORS_ORIGIN=https://ai-recruitment-system-test-deploy-1.vercel.app,http://localhost:3000
```

## 4. Cấu hình URL trong Supabase

Trong Authentication > URL Configuration:

```text
Site URL:
https://ai-recruitment-system-test-deploy-1.vercel.app
```

Redirect allow list:

```text
https://ai-recruitment-system-test-deploy-1.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Nếu cần hỗ trợ Vercel Preview, thêm pattern preview phù hợp nhưng không dùng wildcard rộng hơn phạm vi dự án.

## 5. Email/Password và OTP

Trong Authentication > Providers > Email:

- Bật Email provider.
- Bật Confirm email.
- Không bật Auto confirm.

Trong Authentication > Email Templates > Confirm signup, dùng `{{ .Token }}` để gửi mã OTP:

```html
<h2>Xác minh email SmartRecruit AI</h2>
<p>Mã xác minh của bạn là:</p>
<p style="font-size: 28px; font-weight: 700; letter-spacing: 8px;">
  {{ .Token }}
</p>
<p>Nhập mã này tại trang xác minh email. Không chia sẻ mã cho người khác.</p>
```

Frontend xác minh mã bằng `verifyOtp({ email, token, type: "email" })` và gửi lại bằng `resend({ type: "signup", email })`.

Email mặc định của Supabase chỉ phù hợp để development. Trước production cần cấu hình SMTP riêng trong Authentication > SMTP Settings.

## 6. Google OAuth

### Google Cloud

Tạo OAuth Client loại Web Application.

Authorized JavaScript origins:

```text
https://ai-recruitment-system-test-deploy-1.vercel.app
http://localhost:3000
```

Authorized redirect URI phải là callback của Supabase, không phải callback của Next.js:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Giá trị chính xác có thể copy từ trang Google provider trong Supabase Dashboard.

### Supabase

Trong Authentication > Providers > Google:

- Bật Google provider.
- Nhập Google Client ID.
- Nhập Google Client Secret.

Client Secret chỉ lưu trong Google/Supabase Dashboard.

## 7. Tạo ADMIN đầu tiên

1. Tạo một user trong Authentication > Users của Supabase.
2. Copy UUID của user.
3. Trên máy/backend có đầy đủ secret, chạy:

```powershell
$env:ADMIN_USER_ID="<supabase-auth-user-uuid>"
npm run auth:bootstrap-admin
Remove-Item Env:ADMIN_USER_ID
```

Script xác minh user qua Supabase Admin API, tạo `public.users`, gán role `ADMIN` và ghi audit log.

Không đưa `ADMIN_USER_ID` thật hoặc mật khẩu ADMIN vào Git.

Sau đó ADMIN hiện hữu có thể mời ADMIN mới qua:

```http
POST /api/auth/admins
Authorization: Bearer <admin-access-token>
Content-Type: application/json

{
  "email": "new-admin@example.com",
  "fullName": "New Administrator"
}
```

Để invitation hoạt động với SSR, sửa template **Invite user** thành liên kết
dùng token hash:

```html
<h2>Bạn được mời làm quản trị viên SmartRecruit AI</h2>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">
    Chấp nhận lời mời
  </a>
</p>
```

## 8. Kiểm tra nhanh

```powershell
cd backend
npm run build
npm test

cd ../frontend
npm run lint
npm run build
```

Kiểm tra thủ công:

1. Candidate signup bằng email và OTP.
2. Recruiter signup bằng email và OTP.
3. Candidate/Recruiter signup bằng Google.
4. Google login từ trang login với user mới phải yêu cầu chọn loại tài khoản.
5. Client gửi `role=ADMIN` tới bootstrap phải bị validation từ chối.
6. User đã tồn tại không thể đổi role bằng cách gọi lại bootstrap.
