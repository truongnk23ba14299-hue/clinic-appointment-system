# Hệ Thống Đặt Lịch Khám Bệnh Group 9 (MVP)
### Group 9 - Clinic Appointment Booking System

Dự án đã được tái cấu trúc và hoàn thiện toàn bộ theo đúng tài liệu đặc tả **Kế Hoạch Triển Khai MVP**:
- **Frontend**: React 18 + Vite + React Router (Đầy đủ 16 routes cho Public, Patient, Doctor, Admin).
- **Backend**: Python Flask REST API + SQLAlchemy + JWT Authentication + Phân quyền RBAC.
- **Database**: 6 bảng chuẩn hóa (`users`, `patients`, `doctors`, `specialties`, `doctor_schedules`, `appointments`) kèm `database/schema.sql` và `database/seed.sql`.
- **Nghiệp vụ**: Backend trực tiếp kiểm soát chống double booking, chặn đặt lịch quá khứ, giải phóng slot khi hủy, phân quyền truy cập chặt chẽ.
- **Kiểm thử**: 17/17 Test Case bắt buộc (TC-001 → TC-017) vượt qua 100%.

---

## 👥 3 Tài Khoản Demo Khởi Tạo Sẵn

| Vai trò | Email đăng nhập | Mật khẩu | Mô tả |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinic.com` | `Admin@123` | Quản trị viên tối cao: quản lý Bác sĩ, Chuyên khoa, Lịch hẹn |
| **Doctor** | `doctor.an@clinic.com` | `Doctor@123` | BS. CKII Nguyễn Văn An (Nội khoa): duyệt lịch, hoàn tất khám |
| **Patient** | `patient.hung@gmail.com` | `Patient@123` | Bệnh nhân Nguyễn Văn Hùng: tìm bác sĩ, đặt lịch, hủy lịch |

*(Giao diện Đăng nhập có sẵn 3 nút chọn nhanh tài khoản Demo giúp bạn đăng nhập thử nghiệm ngay chỉ với 1 click)*

---

## 📊 Sơ Đồ Cơ Sở Dữ Liệu (ERD)

```mermaid
erDiagram
    USERS ||--o| PATIENTS : "1 - 1"
    USERS ||--o| DOCTORS : "1 - 1"
    SPECIALTIES ||--o{ DOCTORS : "1 - N"
    DOCTORS ||--o{ DOCTOR_SCHEDULES : "1 - N"
    PATIENTS ||--o{ APPOINTMENTS : "1 - N"
    DOCTORS ||--o{ APPOINTMENTS : "1 - N"
    DOCTOR_SCHEDULES ||--o| APPOINTMENTS : "1 - 1"

    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        string role "PATIENT | DOCTOR | ADMIN"
        datetime created_at
        datetime updated_at
    }

    PATIENTS {
        int id PK
        int user_id FK,UK
        string phone
        date date_of_birth
        string gender
        text address
    }

    DOCTORS {
        int id PK
        int user_id FK,UK
        int specialty_id FK
        string phone
        text description
        int experience_years
        boolean active
    }

    SPECIALTIES {
        int id PK
        string name UK
        text description
        boolean active
    }

    DOCTOR_SCHEDULES {
        int id PK
        int doctor_id FK
        date date
        string start_time
        string end_time
        boolean is_available
    }

    APPOINTMENTS {
        int id PK
        int patient_id FK
        int doctor_id FK
        int schedule_id FK
        date appointment_date
        string start_time
        text reason
        string status "PENDING | CONFIRMED | COMPLETED | CANCELLED"
        datetime created_at
        datetime updated_at
    }
```

---

## 🌐 Danh Sách 16 React Pages & Routes

| Route | Component | Vai trò | Chức năng |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Banner trượt, giới thiệu chuyên khoa nổi bật, đội ngũ bác sĩ |
| `/login` | `Login.jsx` | Public | Đăng nhập tài khoản, hỗ trợ quick-fill demo, điều hướng theo role |
| `/register` | `Register.jsx` | Public | Đăng ký tài khoản Bệnh nhân mới |
| `/doctors` | `Doctors.jsx` | Public | Tìm kiếm theo tên bác sĩ và lọc theo chuyên khoa |
| `/doctors/:id` | `DoctorDetail.jsx` | Public | Xem thông tin chi tiết tiểu sử và các khung giờ khám khả dụng |
| `/specialties` | `Specialties.jsx` | Public | Danh mục các chuyên khoa tại phòng khám |
| `/patient/appointments/book` | `BookAppointment.jsx` | Patient | Chọn bác sĩ, ngày, slot khả dụng và đặt lịch hẹn |
| `/patient/appointments` | `MyAppointments.jsx` | Patient | Xem danh sách lịch khám của bản thân, lọc trạng thái, hủy lịch |
| `/patient/profile` | `PatientProfile.jsx` | Patient | Cập nhật hồ sơ bệnh nhân (SĐT, ngày sinh, địa chỉ) |
| `/doctor/dashboard` | `DoctorDashboard.jsx` | Doctor | Xem nhanh số ca khám hôm nay, lịch cần duyệt |
| `/doctor/schedule` | `DoctorSchedule.jsx` | Doctor | Bác sĩ thêm/xóa các khung giờ khám khả dụng của chính mình |
| `/doctor/appointments` | `DoctorAppointments.jsx` | Doctor | Danh sách bệnh nhân đặt khám, xác nhận (Confirm) và hoàn tất (Complete) |
| `/admin/dashboard` | `AdminDashboard.jsx` | Admin | Bảng điều khiển quản trị số liệu thống kê |
| `/admin/doctors` | `ManageDoctors.jsx` | Admin | Thêm mới bác sĩ, cấp tài khoản, kích hoạt/vô hiệu hóa |
| `/admin/specialties` | `ManageSpecialties.jsx` | Admin | Quản lý danh mục chuyên khoa (Thêm, sửa, vô hiệu hóa) |
| `/admin/appointments` | `ManageAppointments.jsx` | Admin | Quản lý toàn bộ lịch hẹn hệ thống, can thiệp đổi trạng thái hoặc hủy |

---

## 📡 API Contract (Flask REST API)

| Module | Phương thức + Endpoint | Vai trò yêu cầu | Chức năng |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/auth/register` | Public | Đăng ký tài khoản Bệnh nhân mới |
| **Auth** | `POST /api/auth/login` | Public | Đăng nhập hệ thống → Nhận JWT token + thông tin user/role |
| **Auth** | `GET /api/auth/me` | Logged In | Lấy thông tin tài khoản hiện tại |
| **Auth** | `PUT /api/auth/profile` | Logged In | Cập nhật thông tin cá nhân |
| **Doctor** | `GET /api/doctors` | Public | Tìm kiếm và lọc danh sách bác sĩ |
| **Doctor** | `GET /api/doctors/:id` | Public | Xem chi tiết thông tin bác sĩ |
| **Doctor** | `POST /api/doctors` | Admin | Admin thêm mới bác sĩ và tài khoản đăng nhập |
| **Doctor** | `PUT /api/doctors/:id` | Admin | Admin cập nhật thông tin bác sĩ |
| **Doctor** | `DELETE /api/doctors/:id` | Admin | Admin vô hiệu hóa bác sĩ |
| **Specialty** | `GET /api/specialties` | Public | Lấy danh sách chuyên khoa |
| **Specialty** | `POST /api/specialties` | Admin | Admin thêm mới chuyên khoa |
| **Specialty** | `PUT /api/specialties/:id` | Admin | Admin chỉnh sửa chuyên khoa |
| **Specialty** | `DELETE /api/specialties/:id` | Admin | Admin vô hiệu hóa chuyên khoa |
| **Schedule** | `GET /api/doctors/:id/schedules`| Public | Xem lịch khám khả dụng của bác sĩ |
| **Schedule** | `POST /api/schedules` | Doctor | Bác sĩ tạo khung giờ khám mới |
| **Schedule** | `PUT /api/schedules/:id` | Doctor | Bác sĩ sửa khung giờ khám của mình |
| **Schedule** | `DELETE /api/schedules/:id` | Doctor | Bác sĩ xóa khung giờ khám của mình |
| **Appointment** | `POST /api/appointments` | Patient | Bệnh nhân đặt lịch khám (kiểm tra double booking & quá khứ) |
| **Appointment** | `GET /api/appointments` | Logged In | Xem danh sách lịch hẹn theo vai trò (Bệnh nhân/Bác sĩ/Admin) |
| **Appointment** | `GET /api/appointments/:id` | Logged In | Xem chi tiết lịch hẹn |
| **Appointment** | `PUT /api/appointments/:id/status` | Doctor/Admin | Bác sĩ Confirm/Complete hoặc Admin đổi trạng thái |
| **Appointment** | `DELETE /api/appointments/:id` | Patient/Admin | Hủy lịch hẹn hợp lệ (giải phóng slot schedule) |

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi động Backend (Flask REST API)
Mở một cửa sổ Terminal tại thư mục gốc của dự án:
```bash
# Di chuyển vào backend
cd backend

# Khởi chạy server Flask (Port 5000)
python run.py
```
> **Cơ sở dữ liệu:**
> - Mặc định hệ thống tự động khởi tạo và seed dữ liệu vào `backend/clinic.db` (SQLite) để chạy ngay lập tức mà không cần cài đặt thêm MySQL service.
> - Nếu muốn kết nối tới MySQL thật, bạn chỉ cần cấu hình biến môi trường `DATABASE_URL` trong file `.env`:
>   ```env
>   DATABASE_URL=mysql+pymysql://root:matkhau@localhost:3306/clinic_db
>   ```
> - File `database/schema.sql` và `database/seed.sql` đã sẵn sàng để import trực tiếp vào MySQL Workbench / phpMyAdmin nếu cần.

### 2. Khởi động Frontend (React + Vite)
Mở một cửa sổ Terminal thứ hai:
```bash
# Di chuyển vào frontend
cd frontend

# Khởi chạy dev server (Port 3000)
npm run dev
```
Truy cập trình duyệt tại địa chỉ: **`http://localhost:3000`**

---

## 🧪 Báo Cáo Kiểm Thử Tự Động (17/17 Test Cases)

Để chạy bộ kiểm thử tự động xác thực toàn bộ các quy tắc nghiệp vụ:
```bash
python backend/tests/test_mandatory_suite.py
```

Kết quả thực thi:
```
Ran 17 tests in 4.006s - OK
```

| Mã kiểm thử | Tên trường hợp kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :---: |
| **TC-001** | Register email mới | Tạo tài khoản thành công (HTTP 201) | ✅ PASS |
| **TC-002** | Register email trùng | Bị từ chối (HTTP 409) | ✅ PASS |
| **TC-003** | Login đúng / sai mật khẩu | Đúng: trả về JWT; Sai: lỗi 401 | ✅ PASS |
| **TC-004** | Patient tìm kiếm Bác sĩ | Trả về danh sách chính xác | ✅ PASS |
| **TC-005** | Patient xem Schedule | Chỉ hiển thị slot khả dụng (`is_available=1`) | ✅ PASS |
| **TC-006** | Book appointment mới | Tạo lịch trạng thái PENDING, khóa slot | ✅ PASS |
| **TC-007** | Doctor double booking | Request thứ 2 cùng giờ bị từ chối | ✅ PASS |
| **TC-008** | Patient double booking | Bệnh nhân đặt trùng giờ bị từ chối | ✅ PASS |
| **TC-009** | Book lịch ngày quá khứ | Bị từ chối (HTTP 400) | ✅ PASS |
| **TC-010** | Patient xem appointment | Chỉ thấy lịch của chính mình | ✅ PASS |
| **TC-011** | Hủy lịch hẹn hợp lệ | Đổi sang CANCELLED và mở lại slot khả dụng | ✅ PASS |
| **TC-012** | Hủy lịch COMPLETED | Bị từ chối (HTTP 400) | ✅ PASS |
| **TC-013** | Doctor xác nhận lịch | Chuyển trạng thái PENDING → CONFIRMED | ✅ PASS |
| **TC-014** | Doctor hoàn tất khám | Chuyển trạng thái CONFIRMED → COMPLETED | ✅ PASS |
| **TC-015** | Doctor sửa lịch người khác | Bị chặn với HTTP 403 Forbidden | ✅ PASS |
| **TC-016** | Patient gọi Admin API | Bị chặn với HTTP 403 Forbidden | ✅ PASS |
| **TC-017** | Admin CRUD Doctor/Specialty | Thực hiện tạo, sửa, xóa thành công | ✅ PASS |
