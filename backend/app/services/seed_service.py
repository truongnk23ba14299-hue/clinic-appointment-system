from datetime import date, timedelta
from ..models import db, User, Patient, Doctor, Specialty, DoctorSchedule, Appointment

class SeedService:
    @staticmethod
    def seed_data():
        """Khởi tạo dữ liệu mẫu nếu chưa có dữ liệu trong bảng users"""
        if User.query.first():
            return  # Đã có dữ liệu

        print("[SeedService] Starting seed data initialization...")

        # 1. Chuyên khoa
        specialties_data = [
            ('Nội khoa', 'Khám tổng quát, bệnh mãn tính, tầm soát sức khỏe định kỳ'),
            ('Nhi khoa', 'Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh, trẻ nhỏ và thanh thiếu niên'),
            ('Da liễu', 'Chẩn đoán và điều trị các vấn đề về da, tóc, móng và thẩm mỹ da nội khoa'),
            ('Tim mạch', 'Khám và điều trị các bệnh lý tim mạch, huyết áp và mạch máu'),
            ('Tai Mũi Họng', 'Chẩn đoán và điều trị các bệnh lý tai, mũi và họng người lớn & trẻ em'),
            ('Mắt', 'Khám, đo thị lực, kiểm soát khúc xạ và điều trị các bệnh về mắt')
        ]
        spec_objs = []
        for name, desc in specialties_data:
            s = Specialty(name=name, description=desc, active=True)
            db.session.add(s)
            spec_objs.append(s)
        db.session.flush()

        # 2. Users Demo
        # Admin
        admin = User(name='Hệ Thống Quản Trị Viên', email='admin@clinic.com', role='ADMIN')
        admin.set_password('Admin@123')
        db.session.add(admin)

        # Doctors
        doc1_u = User(name='BS. CKII Nguyễn Văn An', email='doctor.an@clinic.com', role='DOCTOR')
        doc1_u.set_password('Doctor@123')
        db.session.add(doc1_u)

        doc2_u = User(name='ThS.BS Đặng Thị Mai', email='doctor.mai@clinic.com', role='DOCTOR')
        doc2_u.set_password('Doctor@123')
        db.session.add(doc2_u)

        doc3_u = User(name='ThS.BS Lê Minh Cường', email='doctor.cuong@clinic.com', role='DOCTOR')
        doc3_u.set_password('Doctor@123')
        db.session.add(doc3_u)

        doc4_u = User(name='PGS.TS Phạm Thu Hà', email='doctor.ha@clinic.com', role='DOCTOR')
        doc4_u.set_password('Doctor@123')
        db.session.add(doc4_u)

        doc5_u = User(name='BS. CKI Hoàng Văn Đức', email='doctor.duc@clinic.com', role='DOCTOR')
        doc5_u.set_password('Doctor@123')
        db.session.add(doc5_u)

        doc6_u = User(name='BS. CKI Vũ Thị Lan', email='doctor.lan@clinic.com', role='DOCTOR')
        doc6_u.set_password('Doctor@123')
        db.session.add(doc6_u)

        # Patients
        pat1_u = User(name='Nguyễn Văn Hùng', email='patient.hung@gmail.com', role='PATIENT')
        pat1_u.set_password('Patient@123')
        db.session.add(pat1_u)

        pat2_u = User(name='Trần Thị Mai', email='patient.lan@gmail.com', role='Patient@123')
        pat2_u.set_password('Patient@123')
        pat2_u.email = 'patient.lan@gmail.com'
        pat2_u.role = 'PATIENT'
        db.session.add(pat2_u)

        db.session.flush()

        # 3. Doctor Profiles
        doc1 = Doctor(
            user_id=doc1_u.id,
            specialty_id=spec_objs[0].id, # Nội khoa
            phone='0901234567',
            description='Chuyên gia hàng đầu về Nội khoa với hơn 12 năm kinh nghiệm chẩn đoán và điều trị các bệnh mãn tính.',
            experience_years=12,
            active=True
        )
        doc2 = Doctor(
            user_id=doc2_u.id,
            specialty_id=spec_objs[1].id, # Nhi khoa
            phone='0907654321',
            description='Thạc sĩ chuyên ngành Nhi khoa, tận tâm, giàu kinh nghiệm chăm sóc và thăm khám cho các bệnh nhi.',
            experience_years=7,
            active=True
        )
        doc3 = Doctor(
            user_id=doc3_u.id,
            specialty_id=spec_objs[2].id, # Da liễu
            phone='0912345678',
            description='Bác sĩ chuyên khoa Da liễu, chuyên sâu về điều trị mụn, sắc tố và phục hồi da liễu thẩm mỹ.',
            experience_years=10,
            active=True
        )
        doc4 = Doctor(
            user_id=doc4_u.id,
            specialty_id=spec_objs[3].id, # Tim mạch
            phone='0934567890',
            description='Chuyên gia Tim mạch hàng đầu với hơn 15 năm kinh nghiệm điều trị tăng huyết áp, bệnh mạch vành và rối loạn nhịp tim.',
            experience_years=15,
            active=True
        )
        doc5 = Doctor(
            user_id=doc5_u.id,
            specialty_id=spec_objs[4].id, # Tai Mũi Họng
            phone='0945678901',
            description='Bác sĩ chuyên khoa Tai Mũi Họng với 9 năm kinh nghiệm nội soi chẩn đoán và điều trị viêm xoang, viêm amidan, viêm họng mãn tính.',
            experience_years=9,
            active=True
        )
        doc6 = Doctor(
            user_id=doc6_u.id,
            specialty_id=spec_objs[5].id, # Mắt
            phone='0956789012',
            description='Chuyên gia Nhãn khoa với 11 năm kinh nghiệm khám đo khúc xạ mắt, điều trị các bệnh lý giác mạc và tật khúc xạ trẻ em.',
            experience_years=11,
            active=True
        )
        db.session.add_all([doc1, doc2, doc3, doc4, doc5, doc6])
        db.session.flush()

        # 4. Patient Profiles
        pat1 = Patient(
            user_id=pat1_u.id,
            phone='0336578262',
            date_of_birth=date(1990, 5, 15),
            gender='Nam',
            address='Số 12 ngõ 45 Hai Bà Trưng, Hà Nội'
        )
        pat2 = Patient(
            user_id=pat2_u.id,
            phone='0988776655',
            date_of_birth=date(1995, 10, 20),
            gender='Nữ',
            address='Tòa Sapphire, KĐT Vinhomes Smart City, Nam Từ Liêm, Hà Nội'
        )
        db.session.add_all([pat1, pat2])
        db.session.flush()

        # 5. Doctor Schedules (cho 3 ngày tới)
        tomorrow = date.today() + timedelta(days=1)
        day_after = date.today() + timedelta(days=2)

        time_slots = [
            ("08:00", "08:30"),
            ("08:30", "09:00"),
            ("09:00", "09:30"),
            ("09:30", "10:00"),
            ("10:00", "10:30"),
            ("14:00", "14:30"),
            ("14:30", "15:00"),
            ("15:00", "15:30")
        ]

        sched_objs = []
        for d in [tomorrow, day_after]:
            for doc in [doc1, doc2, doc3, doc4, doc5, doc6]:
                for s_time, e_time in time_slots:
                    sch = DoctorSchedule(
                        doctor_id=doc.id,
                        date=d,
                        start_time=s_time,
                        end_time=e_time,
                        is_available=True
                    )
                    db.session.add(sch)
                    sched_objs.append(sch)
        db.session.flush()

        # 6. Sample Appointments
        if sched_objs:
            s1 = sched_objs[0] # BS An ngày mai 08:00
            s1.is_available = False
            a1 = Appointment(
                patient_id=pat1.id,
                doctor_id=doc1.id,
                schedule_id=s1.id,
                appointment_date=s1.date,
                start_time=s1.start_time,
                reason='Tầm soát bệnh lý dạ dày, ợ chua kéo dài',
                status='CONFIRMED'
            )
            db.session.add(a1)

            s2 = sched_objs[len(time_slots)] # BS Mai ngày mai 08:00
            s2.is_available = False
            a2 = Appointment(
                patient_id=pat2.id,
                doctor_id=doc2.id,
                schedule_id=s2.id,
                appointment_date=s2.date,
                start_time=s2.start_time,
                reason='Bé bị sốt và ho hắng về đêm',
                status='PENDING'
            )
            db.session.add(a2)

        db.session.commit()
        print("[SeedService] Seed data initialized successfully!")
