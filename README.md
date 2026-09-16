# Dự Án Phòng Khám MedBooking - project_clinic(demo)

Dự án đã được phân chia thành 3 thư mục chính nằm trực tiếp trong thư mục gốc `project_clinic(demo)`:

```
project_clinic(demo)/
├── 📂 database/      --> Chứa schema SQL, dữ liệu mẫu seed.sql và data.json
├── 📂 backend/       --> Chứa mã nguồn Node.js / Express server, API routes, controllers
├── 📂 frontend/      --> Chứa giao diện web (HTML, CSS, JS client)
└── 📄 README.md      --> Hướng dẫn mở và chạy dự án
```

---

## 💻 Cách Mở Trong Visual Studio Code (VS Code)

1. Mở **VS Code**.
2. Trên thanh menu, chọn: **File** > **Open Folder...** (hoặc phím tắt `Ctrl + K, Ctrl + O`).
3. Điều hướng tới đường dẫn: `D:\CODE\project_clinic(demo)` và bấm **Select Folder**.
4. Lúc này trong khung Explorer (bên trái) của VS Code, bạn sẽ thấy ngay:
   - 📁 **backend**
   - 📁 **database**
   - 📁 **frontend**

---

## 🚀 Cách Chạy Dự Án

### Cách 1: Xem giao diện Frontend nhanh
- Mở thư mục `frontend/` trong VS Code.
- Nhấp đúp chuột hoặc click chuột phải vào file `frontend/index.html` chọn **Open with Live Server** (hoặc mở trực tiếp bằng trình duyệt Chrome, Edge).

### Cách 2: Chạy Server Backend (API + Frontend)
- Mở Terminal trong VS Code (`Ctrl + ~` hoặc **Terminal > New Terminal**).
- Chạy lệnh:
  ```bash
  cd backend
  npm install
  npm start
  ```
- Truy cập trình duyệt tại địa chỉ: `http://localhost:5000`
