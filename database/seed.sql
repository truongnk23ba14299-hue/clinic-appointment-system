-- CLINIC APPOINTMENT BOOKING SYSTEM
-- Seed Data for MySQL (Dữ liệu mẫu khởi tạo)

-- 1. Thêm Chuyên Khoa (Specialties)
INSERT INTO specialties (id, name, description, active) VALUES
(1, 'Nội khoa', 'Khám tổng quát, bệnh mãn tính, tầm soát sức khỏe định kỳ', 1),
(2, 'Nhi khoa', 'Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh, trẻ nhỏ và thanh thiếu niên', 1),
(3, 'Da liễu', 'Chẩn đoán và điều trị các vấn đề về da, tóc, móng và thẩm mỹ da nội khoa', 1),
(4, 'Tim mạch', 'Khám và điều trị các bệnh lý tim mạch, huyết áp và mạch máu', 1),
(5, 'Tai Mũi Họng', 'Chẩn đoán và điều trị các bệnh lý tai, mũi và họng người lớn & trẻ em', 1),
(6, 'Mắt', 'Khám, đo thị lực, kiểm soát khúc xạ và điều trị các bệnh về mắt', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Thêm Tài khoản mẫu (Users)
-- Mật khẩu mặc định:
-- Admin: Admin@123
-- Doctor: Doctor@123
-- Patient: Patient@123
-- (Các hash mật khẩu mẫu được tạo tương thích với Werkzeug scrypt)
INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES
(1, 'Hệ Thống Quản Trị Viên', 'admin@clinic.com', 'scrypt:32768:8:1$uH3P6Y7uC3vGgqL0$d3ef27c4ffc9779df5c9cfbc6964ef79caae86c478a05c742910793b8e734ca85ad29f6d7ab7d77a06fae9c4021bbfe7fbc6b08702ee6e999c0d4a36f6d5ef66', 'ADMIN', NOW(), NOW()),
(2, 'BS. CKII Nguyễn Văn An', 'doctor.an@clinic.com', 'scrypt:32768:8:1$nN5r2X4Y8mK1lPo9$b186b1f28b7e28325a95610ec3f3e1b04593ceeeacb45be21c7d24268e6f1f4ba407338568eaec60d00f6c243eb2dca79116e0339caec1a8a2bc4a54c86cb321', 'DOCTOR', NOW(), NOW()),
(3, 'ThS.BS Đặng Thị Mai', 'doctor.mai@clinic.com', 'scrypt:32768:8:1$nN5r2X4Y8mK1lPo9$b186b1f28b7e28325a95610ec3f3e1b04593ceeeacb45be21c7d24268e6f1f4ba407338568eaec60d00f6c243eb2dca79116e0339caec1a8a2bc4a54c86cb321', 'DOCTOR', NOW(), NOW()),
(4, 'ThS.BS Lê Minh Cường', 'doctor.cuong@clinic.com', 'scrypt:32768:8:1$nN5r2X4Y8mK1lPo9$b186b1f28b7e28325a95610ec3f3e1b04593ceeeacb45be21c7d24268e6f1f4ba407338568eaec60d00f6c243eb2dca79116e0339caec1a8a2bc4a54c86cb321', 'DOCTOR', NOW(), NOW()),
(5, 'Nguyễn Văn Hùng', 'patient.hung@gmail.com', 'scrypt:32768:8:1$pT9w4V6B2sQ8zMn3$e79e604f4a3fb3ce51872dfca7a1c7c9ecdaae4508ef8396c429c9fe7fa17bcf217983652dbd47cf57424ad4ba9e5264b184ef3d21396a5f573d82a17cb27993', 'PATIENT', NOW(), NOW()),
(6, 'Trần Thị Mai', 'patient.lan@gmail.com', 'scrypt:32768:8:1$pT9w4V6B2sQ8zMn3$e79e604f4a3fb3ce51872dfca7a1c7c9ecdaae4508ef8396c429c9fe7fa17bcf217983652dbd47cf57424ad4ba9e5264b184ef3d21396a5f573d82a17cb27993', 'PATIENT', NOW(), NOW())
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. Thêm Hồ sơ Bác sĩ (Doctors)
INSERT INTO doctors (id, user_id, specialty_id, phone, description, experience_years, active) VALUES
(1, 2, 1, '0901234567', 'Chuyên gia hàng đầu về Nội khoa với hơn 12 năm kinh nghiệm chẩn đoán và điều trị các bệnh mãn tính.', 12, 1),
(2, 3, 2, '0907654321', 'Thạc sĩ chuyên ngành Nhi khoa, tận tâm, giàu kinh nghiệm chăm sóc và thăm khám cho các bệnh nhi.', 7, 1),
(3, 4, 3, '0912345678', 'Bác sĩ chuyên khoa Da liễu, chuyên sâu về điều trị mụn, sắc tố và phục hồi da liễu thẩm mỹ.', 10, 1)
ON DUPLICATE KEY UPDATE phone=VALUES(phone);

-- 4. Thêm Hồ sơ Bệnh nhân (Patients)
INSERT INTO patients (id, user_id, phone, date_of_birth, gender, address) VALUES
(1, 5, '0336578262', '1990-05-15', 'Nam', 'Số 12 ngõ 45 phố Hai Bà Trưng, Hà Nội'),
(2, 6, '0988776655', '1995-10-20', 'Nữ', 'Tòa Sapphire, KĐT Vinhomes Smart City, Nam Từ Liêm, Hà Nội')
ON DUPLICATE KEY UPDATE phone=VALUES(phone);

-- 5. Thêm Lịch Làm Việc (Doctor Schedules)
-- Tạo lịch mẫu cho các ngày tới
INSERT INTO doctor_schedules (id, doctor_id, date, start_time, end_time, is_available) VALUES
(1, 1, '2026-09-20', '08:00', '08:30', 1),
(2, 1, '2026-09-20', '08:30', '09:00', 1),
(3, 1, '2026-09-20', '09:00', '09:30', 1),
(4, 1, '2026-09-20', '09:30', '10:00', 1),
(5, 1, '2026-09-20', '10:00', '10:30', 1),
(6, 1, '2026-09-20', '14:00', '14:30', 1),
(7, 1, '2026-09-20', '14:30', '15:00', 1),
(8, 2, '2026-09-20', '08:30', '09:00', 1),
(9, 2, '2026-09-20', '09:00', '09:30', 1),
(10, 2, '2026-09-20', '09:30', '10:00', 1),
(11, 2, '2026-09-20', '10:00', '10:30', 1),
(12, 3, '2026-09-21', '09:00', '09:30', 1),
(13, 3, '2026-09-21', '09:30', '10:00', 1),
(14, 3, '2026-09-21', '10:00', '10:30', 1)
ON DUPLICATE KEY UPDATE date=VALUES(date);

-- 6. Thêm Lịch Hẹn Khám Mẫu (Appointments)
INSERT INTO appointments (id, patient_id, doctor_id, schedule_id, appointment_date, start_time, reason, status, created_at, updated_at) VALUES
(1, 1, 1, 1, '2026-09-20', '08:00', 'Khám định kỳ tổng quát, đau dạ dày nhẹ kéo dài', 'CONFIRMED', NOW(), NOW()),
(2, 2, 2, 8, '2026-09-20', '08:30', 'Bé bị ho sốt 2 ngày nay, cần tư vấn điều trị', 'PENDING', NOW(), NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Đánh dấu slot đã được đặt là không khả dụng
UPDATE doctor_schedules SET is_available = 0 WHERE id IN (1, 8);
