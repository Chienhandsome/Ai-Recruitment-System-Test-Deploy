# Kế hoạch triển khai Supabase Auth

## 1. Mục tiêu

Xây dựng chức năng xác thực cho AI Recruitment System bằng Supabase Auth với hai phương thức:

1. Đăng ký/đăng nhập bằng Google.
2. Đăng ký/đăng nhập bằng email và mật khẩu, yêu cầu nhập OTP để xác minh email.

Hệ thống có ba role:

- `ADMIN`: quản trị hệ thống, không được đăng ký công khai.
- `RECRUITER`: nhà tuyển dụng.
- `CANDIDATE`: ứng viên.

## 2. Luồng chọn loại tài khoản

Tại trang công khai:

- Người dùng chọn **Tìm công việc phù hợp** sẽ được chuyển đến luồng đăng ký `CANDIDATE`.
- Người dùng chọn **Đăng tin tuyển dụng** sẽ được chuyển đến luồng đăng ký `RECRUITER`.

Client chỉ được yêu cầu một trong hai role `CANDIDATE` hoặc `RECRUITER`. Backend phải kiểm tra allowlist và tuyệt đối không chấp nhận role `ADMIN` từ request đăng ký công khai.

Trong phiên bản đầu tiên, role được chọn khi tạo tài khoản sẽ là role chính của người dùng. Cấu trúc `roles` và `user_roles` vẫn được giữ để hỗ trợ một người có nhiều role trong tương lai.

## 3. Kiến trúc xác thực

### 3.1. Supabase Auth

Supabase Auth chịu trách nhiệm:

- Quản lý tài khoản và mật khẩu.
- Gửi và xác minh OTP.
- Google OAuth.
- Quản lý danh tính trong `auth.identities`.
- Phát hành access token và refresh token.
- Quản lý trạng thái xác minh email.

Không lưu mật khẩu hoặc `password_hash` trong bảng nghiệp vụ.

### 3.2. Frontend Next.js

Frontend sử dụng `@supabase/ssr` và `@supabase/supabase-js` để:

- Đăng ký và đăng nhập.
- Thực hiện Google OAuth theo PKCE flow.
- Xử lý OAuth callback.
- Xác minh OTP.
- Lưu và refresh session an toàn.
- Gửi Supabase access token tới NestJS qua header:

```http
Authorization: Bearer <access_token>
```

### 3.3. Backend NestJS

NestJS chịu trách nhiệm:

- Xác minh JWT do Supabase phát hành.
- Tạo hồ sơ nghiệp vụ sau khi người dùng xác thực thành công.
- Kiểm tra trạng thái tài khoản.
- Kiểm tra role và phân quyền endpoint.
- Quản lý Candidate, Recruiter và Admin.

Frontend không truy cập trực tiếp các bảng nghiệp vụ trong PostgreSQL.

## 4. Điều chỉnh database

### 4.1. Bảng `users`

Điều chỉnh model `User`:

- `id`: PostgreSQL UUID.
- Không tự sinh `id`; sử dụng chính `auth.users.id`.
- Thêm foreign key:

```sql
public.users.id references auth.users(id) on delete cascade
```

- Xóa `password_hash`.
- Giữ các trường:
  - `email`
  - `full_name`
  - `phone`
  - `avatar_url`
  - `status`
  - `last_login_at`
  - `created_at`
  - `updated_at`

Không cần lưu `auth_provider`, vì các phương thức đăng nhập đã được Supabase quản lý trong `auth.identities`.

Không cần lưu thêm `email_verified`, vì Supabase đã có `auth.users.email_confirmed_at`.

### 4.2. Trạng thái tài khoản

Chuẩn hóa `AccountStatus`:

```text
ACTIVE
SUSPENDED
LOCKED
```

- `ACTIVE`: được phép sử dụng hệ thống.
- `SUSPENDED`: bị quản trị viên tạm ngưng.
- `LOCKED`: bị khóa do chính sách bảo mật hoặc quản trị.

Tài khoản email chưa xác minh chỉ tồn tại trong Supabase Auth và chưa được tạo hồ sơ nghiệp vụ trong `public.users`.

### 4.3. Role

Seed ba role:

```text
ADMIN
RECRUITER
CANDIDATE
```

Giữ hai bảng `roles` và `user_roles`. Không sử dụng enum role trực tiếp trong bảng `users`.

### 4.4. Profile

Sau khi xác thực thành công:

- `CANDIDATE`:
  - Tạo `public.users`.
  - Gán role `CANDIDATE`.
  - Tạo bản ghi `candidates`.

- `RECRUITER`:
  - Tạo `public.users`.
  - Gán role `RECRUITER`.
  - Tạo bản ghi `recruiter_profiles`.
  - Chuyển đến onboarding để nhập thông tin công ty, phòng ban và chức danh.

Quá trình tạo user, role và profile phải chạy trong một Prisma transaction và có tính idempotent.

### 4.5. Bảo vệ database

Do dữ liệu nghiệp vụ chỉ được truy cập qua NestJS:

- Không cấp quyền trực tiếp cho Supabase `anon` và `authenticated` trên các bảng nghiệp vụ.
- Bật RLS với chính sách deny-by-default hoặc thu hồi quyền tương ứng.
- Chỉ backend được sử dụng database credentials và Supabase secret key.

## 5. Luồng Email và Password

### 5.1. Đăng ký

1. Người dùng chọn loại tài khoản `CANDIDATE` hoặc `RECRUITER`.
2. Người dùng nhập họ tên, email, mật khẩu và xác nhận mật khẩu.
3. Frontend gọi `supabase.auth.signUp()`.
4. Gửi `full_name` và role mong muốn trong metadata để hỗ trợ giao diện và callback.
5. Supabase gửi OTP xác minh email.
6. Frontend chuyển đến `/verify-email`.
7. Người dùng nhập OTP.
8. Frontend gọi `supabase.auth.verifyOtp()`.
9. Sau khi nhận session, frontend gọi `POST /api/auth/bootstrap`.
10. Backend lấy UUID và email từ JWT, kiểm tra role, sau đó tạo user/profile.
11. Redirect đến dashboard tương ứng.

Role trong metadata không được xem là dữ liệu phân quyền đáng tin cậy. Backend phải tự kiểm tra role hợp lệ và không bao giờ cho phép bootstrap `ADMIN`.

### 5.2. Gửi lại OTP

- Sử dụng `supabase.auth.resend({ type: "signup" })`.
- Có thời gian chờ trước khi gửi lại.
- Giới hạn số lần thử OTP.
- Hiển thị thông báo chung để hạn chế user enumeration.

### 5.3. Đăng nhập

1. Gọi `supabase.auth.signInWithPassword()`.
2. Nếu email chưa xác minh, chuyển người dùng đến trang OTP và cho phép gửi lại mã.
3. Nếu đăng nhập thành công, gọi `/api/auth/bootstrap` theo cơ chế idempotent.
4. Gọi `/api/auth/me` để lấy hồ sơ, role và trạng thái.
5. Redirect theo role.

## 6. Luồng Google Sign-In

1. Người dùng chọn loại tài khoản.
2. Frontend lưu signup intent an toàn cho OAuth callback.
3. Gọi:

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo:
      "https://ai-recruitment-system-test-deploy-1.vercel.app/auth/callback",
  },
});
```

4. Google chuyển người dùng về Supabase.
5. Supabase chuyển về `/auth/callback`.
6. Callback exchange authorization code để nhận session.
7. Frontend gọi `/api/auth/bootstrap`.
8. Backend tạo hồ sơ theo signup intent nếu đây là lần đăng nhập đầu tiên.
9. Redirect đến dashboard tương ứng.

Signup intent chỉ cho phép:

```text
CANDIDATE
RECRUITER
```

Nếu tài khoản đã tồn tại, role hiện có trong database được ưu tiên; client không được tự đổi role qua callback.

Supabase sẽ quản lý việc liên kết Google identity với tài khoản đã xác minh có cùng email.

## 7. API Backend dự kiến

### `POST /api/auth/bootstrap`

- Yêu cầu Supabase access token.
- Chỉ chấp nhận signup intent `CANDIDATE` hoặc `RECRUITER`.
- Tạo user, role và profile nếu chưa tồn tại.
- Không thay đổi role của user đã tồn tại.
- Cập nhật `last_login_at`.

### `GET /api/auth/me`

Trả về:

- Thông tin user.
- Role.
- Account status.
- Candidate hoặc Recruiter profile.
- Trạng thái hoàn thành onboarding.

### API quản trị

Các endpoint dự kiến:

- Tạo tài khoản `ADMIN`.
- Tạo hoặc mời `RECRUITER`.
- Thay đổi trạng thái tài khoản.
- Gán hoặc thu hồi role.

Tất cả endpoint này yêu cầu role `ADMIN`.

## 8. Auth Guard và phân quyền

Tạo các thành phần:

- `SupabaseJwtGuard`: đọc và xác minh bearer token.
- `CurrentUser` decorator: truy cập thông tin user đã xác thực.
- `Roles` decorator: khai báo role được phép.
- `RolesGuard`: kiểm tra role trong database.
- `AccountStatusGuard`: chặn `SUSPENDED` và `LOCKED`.

JWT cần được xác minh bằng JWKS của Supabase hoặc API xác thực chính thức. Không tự triển khai thuật toán xác minh chữ ký.

## 9. Route phía frontend

Các route dự kiến:

```text
/login
/register
/register/candidate
/register/recruiter
/verify-email
/auth/callback
/forgot-password
/update-password
/candidate/onboarding
/recruiter/onboarding
/candidate/dashboard
/recruiter/dashboard
/admin/dashboard
```

Route protection phải xử lý:

- Chưa đăng nhập.
- Đã đăng nhập nhưng sai role.
- Tài khoản chưa hoàn thành onboarding.
- Tài khoản bị suspended hoặc locked.
- Session hết hạn hoặc refresh thất bại.

## 10. Cấu hình Supabase

### 10.1. URL

Production Site URL:

```text
https://ai-recruitment-system-test-deploy-1.vercel.app
```

Production callback:

```text
https://ai-recruitment-system-test-deploy-1.vercel.app/auth/callback
```

Development callback:

```text
http://localhost:3000/auth/callback
```

### 10.2. Email OTP

- Bật Email/Password provider.
- Bật bắt buộc xác minh email.
- Sửa template **Confirm signup** để hiển thị `{{ .Token }}`.
- Dùng email mặc định của Supabase trong giai đoạn development.
- Cấu hình SMTP riêng trước production.

### 10.3. Google OAuth

Cần tạo Google OAuth Web Client và cấu hình:

- Authorized JavaScript origins.
- Supabase callback URL do Dashboard cung cấp.
- Google Client ID.
- Google Client Secret.

Google Client Secret chỉ lưu trong Google/Supabase Dashboard, không đưa vào frontend hoặc repository.

## 11. Tạo tài khoản ADMIN đầu tiên

Vì database ban đầu trống và `ADMIN` chỉ được tạo bởi `ADMIN`, cần một quy trình bootstrap:

1. Tạo user đầu tiên trong Supabase Auth.
2. Chạy script quản trị một lần với UUID của user đó.
3. Script tạo `public.users` và gán role `ADMIN`.
4. Ghi audit log.
5. Vô hiệu hóa hoặc xóa quyền chạy script sau khi hoàn tất.

Không seed email/mật khẩu ADMIN trực tiếp trong source code hoặc migration.

Sau khi có ADMIN đầu tiên, mọi ADMIN mới chỉ được tạo bởi một ADMIN hiện hữu.

## 12. Biến môi trường

### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=https://ai-recruitment-system-test-deploy-1.vercel.app
```

### Backend

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_JWKS_URL=
DATABASE_URL=
DIRECT_URL=
CORS_ORIGIN=https://ai-recruitment-system-test-deploy-1.vercel.app
```

Không đưa `SUPABASE_SECRET_KEY`, database password, Google Client Secret hoặc SMTP password vào frontend.

## 13. Kế hoạch triển khai theo giai đoạn

### Giai đoạn 1: Database

- Cập nhật Prisma schema.
- Tạo migration đổi user ID sang UUID.
- Xóa `password_hash`.
- Thêm foreign key tới `auth.users`.
- Chuẩn hóa status và role.
- Cập nhật seed role.
- Thiết lập quyền database/RLS.

### Giai đoạn 2: Backend Auth

- Cài JWT verification dependency.
- Tạo Auth module.
- Tạo JWT, role và status guard.
- Tạo `/auth/bootstrap` và `/auth/me`.
- Tạo transaction khởi tạo Candidate/Recruiter.
- Thêm Swagger và error response chuẩn.

### Giai đoạn 3: Frontend Auth

- Cài Supabase SSR dependencies.
- Tạo browser/server Supabase client.
- Thay mock login/register bằng API thật.
- Thêm Google button.
- Tạo OTP và OAuth callback.
- Thêm session refresh và route protection.

### Giai đoạn 4: Onboarding

- Candidate onboarding.
- Recruiter onboarding.
- Redirect theo role và trạng thái onboarding.

### Giai đoạn 5: Admin

- Script tạo first ADMIN.
- Admin authentication/authorization.
- Chức năng tạo Admin mới.
- Quản lý trạng thái và role người dùng.

### Giai đoạn 6: Hoàn thiện

- Logout.
- Quên và đặt lại mật khẩu.
- Audit log.
- Rate limiting/CAPTCHA nếu cần.
- Security review.
- Kiểm thử production callback, SMTP và Google OAuth.

## 14. Checklist kiểm thử

### Email/Password

- Đăng ký Candidate thành công.
- Đăng ký Recruiter thành công.
- OTP đúng, sai và hết hạn.
- Gửi lại OTP.
- Email đã tồn tại.
- Đăng nhập khi email chưa xác minh.
- Mật khẩu sai.
- Refresh và hết hạn session.

### Google

- Google signup Candidate.
- Google signup Recruiter.
- Google login user đã tồn tại.
- Google và email/password dùng cùng email đã xác minh.
- Callback lỗi hoặc signup intent bị thiếu.
- Client cố truyền role `ADMIN`.

### Backend và phân quyền

- Request không có token.
- Token giả mạo hoặc hết hạn.
- Candidate truy cập Recruiter API.
- Recruiter truy cập Admin API.
- User bị suspended hoặc locked.
- Bootstrap được gọi nhiều lần nhưng không tạo dữ liệu trùng.
- User hiện có không thể tự đổi role.

### Database

- Xóa Supabase Auth user sẽ xóa `public.users`.
- Quan hệ Candidate/Recruiter xử lý đúng khi user bị xóa.
- Không thể tạo public user không tồn tại trong `auth.users`.
- `anon` và `authenticated` không truy cập trực tiếp bảng nghiệp vụ.

## 15. Điều kiện để kiểm thử đầy đủ

Có thể triển khai code và database ngay vì database chưa có dữ liệu.

Để kiểm thử đầy đủ trên production cần bổ sung:

- Google OAuth Client ID và Client Secret trong Supabase Dashboard.
- SMTP provider và credentials.
- Các Supabase environment variables trên Vercel và backend hosting.
- Email/UUID sẽ được dùng để bootstrap tài khoản ADMIN đầu tiên.

Các secret chỉ được cấu hình qua biến môi trường hoặc Dashboard, không gửi trong chat và không commit vào Git.
