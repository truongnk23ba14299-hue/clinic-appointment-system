-- Dữ liệu mẫu khởi tạo cho Phòng Khám MedBooking (Seed Data)

-- 1. Thêm Chuyên Khoa
INSERT INTO specialties (id, name, description) VALUES
('spec_1', 'Nội khoa', 'Điều trị các bệnh thông thường và chăm sóc sức khỏe tổng quát'),
('spec_2', 'Nhi khoa', 'Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh, trẻ nhỏ và thanh thiếu niên'),
('spec_3', 'Da liễu', 'Chẩn đoán và điều trị các vấn đề về da, tóc và móng'),
('spec_4', 'Tim mạch', 'Khám và điều trị các bệnh lý tim mạch, huyết áp'),
('spec_5', 'Tai Mũi Họng', 'Chẩn đoán và điều trị các bệnh lý tai, mũi và họng'),
('spec_6', 'Mắt', 'Khám, đo và điều trị các vấn đề về thị lực');

-- 2. Thêm Bác Sĩ Mẫu
INSERT INTO doctors (id, name, specialty_name, initials, years_exp, rating, reviews_count, note, color, bio, schedule) VALUES
('d1', 'BS. CKII Nguyễn Văn An', 'Nội khoa', 'AN', 12, 4.9, 128, 'Khám tổng quát, bệnh mãn tính, tầm soát sức khỏe định kỳ', '#0D9488', 'BS. CKII Nguyễn Văn An là chuyên gia hàng đầu về Nội khoa với hơn 12 năm kinh nghiệm...', 'Thứ 2 - Thứ 6 (08:00 - 16:30)'),
('d1b', 'ThS.BS Đặng Thị Mai', 'Nội khoa', 'ĐM', 7, 4.8, 95, 'Nội tiết, tiểu đường, đái tháo đường & rối loạn chuyển hóa', '#0284C7', 'ThS.BS Đặng Thị Mai có kinh nghiệm chuyên sâu về các bệnh lý nội tiết và đái tháo đường...', 'Thứ 2 - Thứ 7 (08:30 - 16:00)'),
('d1c', 'BS. CKI Trịnh Văn Sơn', 'Nội khoa', 'TS', 16, 5.0, 210, 'Tiêu hóa, gan mật, nội soi tiêu hóa không đau', '#4F46E5', 'BS. CKI Trịnh Văn Sơn với 16 năm kinh nghiệm chuyên ngành Nội tiêu hóa và Gan mật...', 'Thứ 3 - Chủ Nhật (08:00 - 15:30)'),
('d2', 'BS. CKI Trần Thị Bình', 'Nhi khoa', 'TB', 8, 4.9, 164, 'Khám nhi tổng quát, tư vấn vắc xin & tiêm chủng', '#EC4899', 'BS. CKI Trần Thị Bình rất mát tay trong việc chăm sóc và điều trị cho trẻ nhỏ...', 'Thứ 2 - Thứ 6 (08:00 - 16:30)'),
('d2b', 'ThS.BS Nguyễn Hoàng Nam', 'Nhi khoa', 'HN', 6, 4.7, 82, 'Nhi sơ sinh, hô hấp nhi & bệnh lý theo mùa', '#8B5CF6', 'ThS.BS Nguyễn Hoàng Nam chuyên về các bệnh lý hô hấp và sơ sinh ở trẻ em...', 'Thứ 2 - Thứ 7 (09:00 - 17:00)'),
('d3', 'ThS.BS Lê Minh Cường', 'Da liễu', 'MC', 10, 4.8, 112, 'Da liễu tổng quát, dị ứng da, thẩm mỹ da nội khoa', '#10B981', 'ThS.BS Lê Minh Cường có kinh nghiệm dày dặn trong chẩn đoán và điều trị các bệnh lý da liễu...', 'Thứ 2 - Thứ 6 (08:30 - 16:30)'),
('d4', 'PGS.TS Phạm Thu Hà', 'Tim mạch', 'TH', 15, 5.0, 310, 'Khám tim mạch, cao huyết áp & bệnh lý van tim', '#EF4444', 'PGS.TS Phạm Thu Hà là chuyên gia hàng đầu về Tim mạch học tại Việt Nam...', 'Thứ 2, Thứ 4, Thứ 6 (08:00 - 12:00)'),
('d5', 'BS. CKI Hoàng Văn Đức', 'Tai Mũi Họng', 'VĐ', 9, 4.8, 105, 'Tai mũi họng tổng quát, viêm họng, viêm amidan', '#14B8A6', 'BS. CKI Hoàng Văn Đức am hiểu sâu sắc về bệnh lý tai mũi họng người lớn và trẻ em...', 'Thứ 2 - Thứ 6 (08:00 - 16:30)'),
('d6', 'BS. CKI Vũ Thị Lan', 'Mắt', 'TL', 11, 4.9, 156, 'Khám và đo khúc xạ mắt, điều trị nhược thị ở trẻ em', '#0EA5E9', 'BS. CKI Vũ Thị Lan có 11 năm kinh nghiệm trong kiểm soát cận thị học đường...', 'Thứ 2 - Thứ 6 (08:00 - 16:30)');

-- 3. Thêm Dịch Vụ Mẫu
INSERT INTO services (id, category, name, price, popular, description) VALUES
('s1', 'Gói khám tổng quát', 'Gói Khám Sức Khỏe Cơ Bản', '850.000 đ', false, 'Tầm soát sức khỏe tổng quát, đánh giá chức năng gan, thận, đường huyết và các chỉ số máu cơ bản.'),
('s2', 'Gói khám tổng quát', 'Gói Khám Sức Khỏe Nâng Cao', '1.950.000 đ', true, 'Gói tầm soát toàn diện chuyên sâu, kết hợp siêu âm ổ bụng tổng quát và kiểm tra mỡ máu, tim mạch.'),
('s3', 'Gói khám tổng quát', 'Gói Tầm Soát Sức Khỏe VIP / Doanh Nhân', '3.500.000 đ', false, 'Tầm soát rủi ro đột quỵ, tim mạch chuyên sâu, xét nghiệm Marker tầm soát ung thư sớm phổ biến.'),
('s4', 'Chuyên khoa', 'Khám Chuyên Khoa Nhi & Tiêm Chủng', '300.000 đ', false, 'Khám tổng quát sự phát triển thể chất của bé, tư vấn lịch tiêm phòng chủng vi-rút đúng chuẩn y tế.'),
('s5', 'Chuyên khoa', 'Khám & Soi Da Thẩm Mỹ Chuyên Sâu', '450.000 đ', false, 'Soi da vi phẫu, phát hiện mụn ẩn, sắc tố nám, tổn thương da và xây dựng liệu trình phục hồi.'),
('s6', 'Xét nghiệm', 'Xét Nghiệm Vi-rút & Tầm Soát Bệnh Lý', '600.000 đ', false, 'Xét nghiệm định lượng vi-rút Viêm gan B, C, cúm mùa, sốt xuất huyết Dengue nhận kết quả sau 2 giờ.');

-- 4. Thêm Đánh Giá Mẫu
INSERT INTO reviews (id, doctor_id, reviewer_name, rating, review_date, comment, verified) VALUES
('r1', 'd1', 'Nguyễn Văn Hùng', 5, '10/09/2026', 'Bác sĩ An giải thích rất kĩ lưỡng và nhẹ nhàng. Tôi bị đau dạ dày nhiều năm nhờ bác sĩ kê đơn chuẩn giờ đã đỡ hẳn.', true),
('r2', 'd1', 'Trần Thị Mai', 5, '02/09/2026', 'Phòng khám sạch đẹp, bác sĩ An thăm khám tận tình, không lạm dụng kháng sinh. Rất hài lòng!', true),
('r3', 'd1c', 'Phạm Quốc Bảo', 5, '12/09/2026', 'Nội soi dạ dày với bác sĩ Sơn nhẹ nhàng vô cùng, không hề có cảm giác đau hay khó chịu. Cảm ơn bác sĩ!', true),
('r4', 'd2', 'Nguyễn Thị Ngọc', 5, '14/09/2026', 'BS Bình rất dịu dàng với em bé, bé nhà mình bình thường sợ bác sĩ lắm mà gặp cô Bình lại ngoan ngoãn hợp tác.', true);
