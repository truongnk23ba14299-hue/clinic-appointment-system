-- Cơ sở dữ liệu Phòng Khám Đa Khoa MedBooking
-- Database Schema (MySQL / PostgreSQL / SQLite)

-- 1. Bảng Chuyên Khoa (Specialties)
CREATE TABLE IF NOT EXISTS specialties (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Bác Sĩ (Doctors)
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    specialty_name VARCHAR(100) NOT NULL,
    initials VARCHAR(10) NOT NULL,
    years_exp INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    note VARCHAR(255),
    color VARCHAR(20),
    bio TEXT,
    schedule VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialty_name) REFERENCES specialties(name) ON DELETE CASCADE
);

-- 3. Bảng Trình Độ Học Vấn Bác Sĩ (Doctor Education)
CREATE TABLE IF NOT EXISTS doctor_education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    degree TEXT NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 4. Bảng Kinh Nghiệm Bác Sĩ (Doctor Experience)
CREATE TABLE IF NOT EXISTS doctor_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    experience_detail TEXT NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 5. Bảng Dịch Vụ & Gói Khám (Services)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    price VARCHAR(50) NOT NULL,
    popular BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bảng Tính Năng Gói Khám (Service Features)
CREATE TABLE IF NOT EXISTS service_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(50) NOT NULL,
    feature_text TEXT NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- 7. Bảng Lịch Hẹn Khám (Appointments)
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(100),
    patient_dob DATE,
    patient_gender VARCHAR(20),
    doctor_id VARCHAR(50) NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 8. Bảng Đánh Giá Bác Sĩ (Doctor Reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    reviewer_name VARCHAR(150) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_date VARCHAR(20),
    comment TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
