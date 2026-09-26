# Hệ Thống Đặt Lịch Khám Bệnh MedBooking
### MedBooking - Clinic Appointment Booking System

Dự án được xây dựng theo chuẩn kiến trúc Client - Server tinh gọn:
- **Frontend**: **HTML5 + CSS3 + JavaScript thuần (Vanilla JS)** kết nối RESTful API qua `fetch()`. Giao diện giữ nguyên 100% phong cách thiết kế hiện đại của phòng khám MedBooking, hỗ trợ Responsive trên mọi thiết bị.
- **Backend**: **Python Flask REST API + SQLAlchemy ORM + JWT Authentication**.
- **Khởi chạy tối giản (1 lệnh duy nhất)**: Flask server phục vụ trực tiếp cả giao diện web lẫn API tại cổng `5000`. Không cần `node_modules` hay chạy 2 terminal.
- **Bộ kiểm thử tự động**: 20/20 Test Cases bắt buộc (TC-001 → TC-020) vượt qua 100%.

---

## 👥 3 Tài Khoản Demo Khởi Tạo Sẵn

| Vai trò | Email đăng nhập | Mật khẩu | Chức năng thử nghiệm |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinic.com` | `Admin@123` | Quản trị viên: Quản lý Người dùng (CRUD), Quản lý Lịch hẹn (CRUD) |
| **Doctor** | `doctor.an@clinic.com` | `Doctor@123` | Bác sĩ: Quản lý Lịch khám của mình (CRUD), Duyệt hẹn, Hoàn tất khám |
| **Patient** | `patient.hung@gmail.com` | `Patient@123` | Bệnh nhân: Tìm bác sĩ, Đặt lịch tự điền ngày giờ, Quản lý lịch hẹn cá nhân |

*(Hoặc người dùng có thể tự đăng ký tài khoản Bệnh nhân mới trực tiếp trên trang `login.html`)*

---

## 🌟 10 Chức Năng Cốt Lõi (Khớp 100% yêu cầu đề bài)

| Nhóm vai trò | STT | Chức năng (Function) | Loại tính năng | Mô tả chi tiết |
| :--- | :---: | :--- | :--- | :--- |
| **Patient** | **1** | **Register and Login** | ⭐ Key #1 | Đăng ký tài khoản bệnh nhân, đăng nhập cấp JWT token, lưu trữ phiên đăng nhập. |
| | **2** | **View all doctors (Search & Filter)** | ⭐⭐ Key #2 | Xem danh sách bác sĩ, tìm kiếm theo tên/kinh nghiệm, lọc theo chuyên khoa. |
| | **3** | **View doctor detail** | Main | Xem chi tiết tiểu sử, học vấn, chuyên khoa của bác sĩ và nút đặt lịch trực tiếp. |
| | **4** | **Book Appointment** | ⭐⭐ Key #3 | Đặt lịch khám: **Người đặt lịch tự điền ngày và giờ khám**, chọn bác sĩ, nhập lý do. |
| | **5** | **Manage Appointment (CRUD)** | Main | Bệnh nhân xem danh sách lịch hẹn của mình, **Update full** thông tin lịch hẹn (đổi ngày, giờ, lý do), Hủy/Xóa lịch. |
| **Doctor** | **6** | **Manage Appointments (CRUD)** | Main | Bác sĩ xem danh sách ca khám của mình, **Update full** lịch hẹn (cập nhật trạng thái `PENDING` -> `CONFIRMED` -> `COMPLETED`, điều chỉnh ngày giờ, ghi chú), Hủy/Xóa lịch. |
| **Admin** | **7** | **Manage User (CRUD)** | Main | Admin xem danh sách tất cả tài khoản, tạo mới user (bệnh nhân/bác sĩ/admin), **Update full** thông tin user, Xóa/Vô hiệu hóa user. |
| | **8** | **Manage Appointment (CRUD)** | Main | Admin xem toàn bộ lịch hẹn toàn viện (bộ lọc bác sĩ, ngày, trạng thái), **Update full** thông tin lịch hẹn, Xóa lịch hẹn. |
| **Hệ thống** | **9** | **Role-based Authorization** | 🌟 Advance | Phân quyền bảo mật 3 cấp độ (`PATIENT`, `DOCTOR`, `ADMIN`) ở cả tầng API Backend (Middleware JWT) và giao diện Frontend (Navbar & Chặn trang trái phép). |
| | **10**| **Kiểm tra xung đột lịch & Quản lý phiên** | Main | Chống đặt trùng giờ cùng bác sĩ (Double booking), chống đặt ngày quá khứ, tự động đăng xuất khi hết hạn token. |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
web_project/
├── backend/
│   ├── app/
│   │   ├── middleware/        --> auth_middleware.py (JWT & Role-based guard)
│   │   ├── models/            --> User, Patient, Doctor, Appointment, Specialty
│   │   ├── routes/            --> auth_routes, doctor_routes, appointment_routes, user_routes
│   │   └── services/          --> appointment_service, seed_service
│   ├── clinic.db              --> Cơ sở dữ liệu SQLite tự động tạo và seed sẵn
│   ├── requirements.txt       --> Danh sách thư viện Python
│   ├── run.py                 --> File khởi chạy duy nhất cho cả Web và API
│   └── tests/
│       └── test_mandatory_suite.py  --> Bộ kiểm thử tự động 20/20 test cases
│
├── frontend/                  --> Toàn bộ giao diện HTML, CSS, JavaScript thuần
│   ├── css/                   --> base.css, layout.css, components.css, home.css, responsive.css
│   ├── js/                    --> auth.js (quản lý token, phân quyền, API client), data.js
│   ├── index.html             --> Trang chủ MedBooking
│   ├── login.html             --> Trang Đăng ký & Đăng nhập phân quyền
│   ├── doctors.html           --> Danh sách Bác sĩ có tìm kiếm & lọc chuyên khoa
│   ├── doctor.html            --> Chi tiết tiểu sử Bác sĩ
│   ├── booking.html           --> Đặt lịch khám (tự điền ngày giờ)
│   ├── appointments.html      --> Quản lý lịch khám bệnh nhân (CRUD, Update Full)
│   ├── doctor_appointments.html --> Quản lý ca khám của Bác sĩ (CRUD, Update Full)
│   └── admin.html             --> Quản trị Admin: User CRUD & Appointment CRUD
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Chỉ cần duy nhất 1 lệnh chạy:

1. Mở Terminal (PowerShell hoặc CMD) tại thư mục `c:\web_project`:
   ```bash
   cd backend
   pip install -r requirements.txt
   py run.py
   ```
   *(Nếu trên máy bạn dùng lệnh `python` thay vì `py`, hãy gõ `python run.py`)*

2. Mở trình duyệt web và truy cập địa chỉ:
   👉 **`http://localhost:5000`**

---

## 🧪 Chạy Bộ Kiểm Thử Tự Động (20/20 Test Cases)

Để chạy kiểm thử tự động kiểm tra toàn bộ 20 kịch bản:
```bash
cd backend
py -m unittest tests/test_mandatory_suite.py
```

Kết quả:
```text
Ran 20 tests in 10.547s

OK
```
