import os
import sys
import unittest
from datetime import date, timedelta

# Đảm bảo import được app backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, User, Patient, Doctor, Specialty, DoctorSchedule, Appointment

class MandatoryTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class TestConfig:
            TESTING = True
            SECRET_KEY = 'clinic_super_secret_jwt_key_test_32chars'
            JWT_SECRET_KEY = 'clinic_super_secret_jwt_key_test_32chars'
            JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
            SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
            SQLALCHEMY_TRACK_MODIFICATIONS = False
            CORS_ORIGINS = ['*']

        cls.app = create_app(TestConfig)
        cls.client = cls.app.test_client()

    def setUp(self):
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def get_token(self, email, password):
        res = self.client.post('/api/auth/login', json={'email': email, 'password': password})
        data = res.get_json()
        return data.get('token')

    # TC-001: Register email mới -> Tạo user thành công
    def test_tc001_register_new_email(self):
        payload = {
            'email': 'new_patient_test@gmail.com',
            'password': 'Password@123',
            'name': 'Bệnh Nhân Thử Nghiệm',
            'phone': '0911223344',
            'gender': 'Nam'
        }
        res = self.client.post('/api/auth/register', json=payload)
        data = res.get_json()
        self.assertEqual(res.status_code, 201)
        self.assertTrue(data['success'])
        self.assertIn('token', data)
        self.assertEqual(data['user']['role'], 'PATIENT')

    # TC-002: Register email trùng -> Bị từ chối
    def test_tc002_register_duplicate_email(self):
        payload = {
            'email': 'patient.hung@gmail.com', # Email đã có sẵn từ seed
            'password': 'Password@123',
            'name': 'Trùng Email'
        }
        res = self.client.post('/api/auth/register', json=payload)
        data = res.get_json()
        self.assertIn(res.status_code, [400, 409])
        self.assertFalse(data['success'])

    # TC-003: Login đúng/sai -> Đúng: JWT; sai: lỗi 401
    def test_tc003_login_correct_and_wrong(self):
        # Đúng
        res_ok = self.client.post('/api/auth/login', json={
            'email': 'admin@clinic.com',
            'password': 'Admin@123'
        })
        self.assertEqual(res_ok.status_code, 200)
        self.assertIn('token', res_ok.get_json())

        # Sai mật khẩu
        res_fail = self.client.post('/api/auth/login', json={
            'email': 'admin@clinic.com',
            'password': 'WrongPassword123'
        })
        self.assertEqual(res_fail.status_code, 401)
        self.assertFalse(res_fail.get_json()['success'])

    # TC-004: Patient tìm Doctor -> Danh sách đúng
    def test_tc004_search_doctors(self):
        res = self.client.get('/api/doctors?search=An')
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertGreater(data['count'], 0)
        # Kiểm tra đúng tên bác sĩ An
        found = any('An' in d['name'] for d in data['doctors'])
        self.assertTrue(found)

    # TC-005: Patient xem Schedule -> Chỉ slot khả dụng
    def test_tc005_view_available_schedules(self):
        # Lấy bác sĩ 1
        res = self.client.get('/api/doctors/1/schedules?available_only=true')
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        for s in data['schedules']:
            self.assertTrue(s['is_available'])

    # TC-006: Book appointment -> Tạo PENDING
    def test_tc006_book_appointment_pending(self):
        token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        # Tìm một schedule trống của bác sĩ 1
        res_sch = self.client.get('/api/doctors/1/schedules?available_only=true')
        schedules = res_sch.get_json()['schedules']
        self.assertGreater(len(schedules), 0)
        chosen_sch = schedules[0]

        res = self.client.post('/api/appointments', json={
            'doctor_id': 1,
            'schedule_id': chosen_sch['id'],
            'reason': 'Khám định kỳ đau tức ngực'
        }, headers={'Authorization': f'Bearer {token}'})

        data = res.get_json()
        self.assertEqual(res.status_code, 201)
        self.assertEqual(data['appointment']['status'], 'PENDING')

    # TC-007: Doctor double booking -> Request thứ 2 bị từ chối
    def test_tc007_doctor_double_booking(self):
        # Tạo schedule mới vào tương lai
        future_date = date.today() + timedelta(days=10)
        doc = db.session.get(Doctor, 1)
        sch = DoctorSchedule(
            doctor_id=doc.id,
            date=future_date,
            start_time='11:00',
            end_time='11:30',
            is_available=True
        )
        db.session.add(sch)
        db.session.commit()

        token1 = self.get_token('patient.hung@gmail.com', 'Patient@123')
        token2 = self.get_token('patient.lan@gmail.com', 'Patient@123')

        # Patient 1 book thành công
        res1 = self.client.post('/api/appointments', json={
            'doctor_id': doc.id,
            'schedule_id': sch.id,
            'reason': 'Đặt lịch 1'
        }, headers={'Authorization': f'Bearer {token1}'})
        self.assertEqual(res1.status_code, 201)

        # Patient 2 cố gắng book cùng slot/schedule đó -> Bị từ chối
        res2 = self.client.post('/api/appointments', json={
            'doctor_id': doc.id,
            'schedule_id': sch.id,
            'reason': 'Đặt lịch trùng'
        }, headers={'Authorization': f'Bearer {token2}'})
        self.assertIn(res2.status_code, [400, 409])
        self.assertFalse(res2.get_json()['success'])

    # TC-008: Patient double booking -> Request bị từ chối
    def test_tc008_patient_double_booking(self):
        # Cùng một thời điểm tương lai, tạo 2 schedule cho 2 bác sĩ khác nhau
        future_date = date.today() + timedelta(days=12)
        sch1 = DoctorSchedule(doctor_id=1, date=future_date, start_time='15:00', end_time='15:30', is_available=True)
        sch2 = DoctorSchedule(doctor_id=2, date=future_date, start_time='15:00', end_time='15:30', is_available=True)
        db.session.add_all([sch1, sch2])
        db.session.commit()

        token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        # Book với bác sĩ 1
        res1 = self.client.post('/api/appointments', json={
            'doctor_id': 1,
            'schedule_id': sch1.id,
            'reason': 'Khám BS 1'
        }, headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res1.status_code, 201)

        # Cố tình book tiếp với bác sĩ 2 vào CÙNG NGÀY + CÙNG GIỜ
        res2 = self.client.post('/api/appointments', json={
            'doctor_id': 2,
            'schedule_id': sch2.id,
            'reason': 'Khám BS 2 cùng giờ'
        }, headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res2.status_code, 400)
        self.assertIn('Patient double booking', res2.get_json()['message'])

    # TC-009: Book ngày quá khứ -> Bị từ chối
    def test_tc009_book_past_date(self):
        past_date = date.today() - timedelta(days=5)
        sch_past = DoctorSchedule(doctor_id=1, date=past_date, start_time='08:00', end_time='08:30', is_available=True)
        db.session.add(sch_past)
        db.session.commit()

        token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        res = self.client.post('/api/appointments', json={
            'doctor_id': 1,
            'schedule_id': sch_past.id,
            'reason': 'Đặt lịch quá khứ'
        }, headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res.status_code, 400)
        self.assertIn('quá khứ', res.get_json()['message'])

    # TC-010: Patient xem appointment -> Chỉ thấy của mình
    def test_tc010_patient_view_own_appointments(self):
        token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        res = self.client.get('/api/appointments', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        pat = Patient.query.filter_by(user_id=User.query.filter_by(email='patient.hung@gmail.com').first().id).first()
        for a in data['appointments']:
            self.assertEqual(a['patient_id'], pat.id)

    # TC-011: Cancel hợp lệ -> CANCELLED + slot available
    def test_tc011_valid_cancel_frees_slot(self):
        token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        future_date = date.today() + timedelta(days=15)
        sch = DoctorSchedule(doctor_id=1, date=future_date, start_time='09:00', end_time='09:30', is_available=True)
        db.session.add(sch)
        db.session.commit()

        # Book
        res_book = self.client.post('/api/appointments', json={
            'doctor_id': 1,
            'schedule_id': sch.id,
            'reason': 'Để hủy thử'
        }, headers={'Authorization': f'Bearer {token}'})
        appt_id = res_book.get_json()['appointment']['id']

        # Cancel
        res_cancel = self.client.delete(f'/api/appointments/{appt_id}', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res_cancel.status_code, 200)
        data = res_cancel.get_json()
        self.assertEqual(data['appointment']['status'], 'CANCELLED')

        # Kiểm tra slot đã được giải phóng (is_available = True)
        updated_sch = db.session.get(DoctorSchedule, sch.id)
        self.assertTrue(updated_sch.is_available)

    # TC-012: Cancel COMPLETED -> Bị từ chối
    def test_tc012_cancel_completed_rejected(self):
        token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        pat = Patient.query.filter_by(user_id=User.query.filter_by(email='patient.hung@gmail.com').first().id).first()
        sch = DoctorSchedule(doctor_id=1, date=date.today() + timedelta(days=1), start_time='08:00', end_time='08:30', is_available=False)
        db.session.add(sch)
        db.session.commit()

        completed_appt = Appointment(
            patient_id=pat.id,
            doctor_id=1,
            schedule_id=sch.id,
            appointment_date=sch.date,
            start_time=sch.start_time,
            status='COMPLETED'
        )
        db.session.add(completed_appt)
        db.session.commit()

        res = self.client.delete(f'/api/appointments/{completed_appt.id}', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res.status_code, 400)
        self.assertIn('COMPLETED', res.get_json()['message'])

    # TC-013: Doctor Confirm -> PENDING -> CONFIRMED
    def test_tc013_doctor_confirm(self):
        doc_token = self.get_token('doctor.an@clinic.com', 'Doctor@123')
        # Lấy lịch hẹn PENDING của bác sĩ 1
        sch = DoctorSchedule(doctor_id=1, date=date.today() + timedelta(days=3), start_time='10:00', end_time='10:30', is_available=False)
        db.session.add(sch)
        db.session.commit()

        pat = Patient.query.first()
        appt = Appointment(
            patient_id=pat.id,
            doctor_id=1,
            schedule_id=sch.id,
            appointment_date=sch.date,
            start_time=sch.start_time,
            status='PENDING'
        )
        db.session.add(appt)
        db.session.commit()

        res = self.client.put(f'/api/appointments/{appt.id}/status', json={'status': 'CONFIRMED'}, headers={'Authorization': f'Bearer {doc_token}'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()['appointment']['status'], 'CONFIRMED')

    # TC-014: Doctor Complete -> CONFIRMED -> COMPLETED
    def test_tc014_doctor_complete(self):
        doc_token = self.get_token('doctor.an@clinic.com', 'Doctor@123')
        sch = DoctorSchedule(doctor_id=1, date=date.today() + timedelta(days=4), start_time='10:00', end_time='10:30', is_available=False)
        db.session.add(sch)
        db.session.commit()

        pat = Patient.query.first()
        appt = Appointment(
            patient_id=pat.id,
            doctor_id=1,
            schedule_id=sch.id,
            appointment_date=sch.date,
            start_time=sch.start_time,
            status='CONFIRMED'
        )
        db.session.add(appt)
        db.session.commit()

        res = self.client.put(f'/api/appointments/{appt.id}/status', json={'status': 'COMPLETED'}, headers={'Authorization': f'Bearer {doc_token}'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()['appointment']['status'], 'COMPLETED')

    # TC-015: Doctor sửa lịch người khác -> 403
    def test_tc015_doctor_edit_other_schedule(self):
        # Bác sĩ An (id=1) đăng nhập nhưng cố sửa lịch của Bác sĩ Mai (id=2)
        doc1_token = self.get_token('doctor.an@clinic.com', 'Doctor@123')
        sch_doc2 = DoctorSchedule(doctor_id=2, date=date.today() + timedelta(days=5), start_time='09:00', end_time='09:30', is_available=True)
        db.session.add(sch_doc2)
        db.session.commit()

        res = self.client.put(f'/api/schedules/{sch_doc2.id}', json={'start_time': '09:15'}, headers={'Authorization': f'Bearer {doc1_token}'})
        self.assertEqual(res.status_code, 403)

    # TC-016: Patient gọi Admin API -> 403
    def test_tc016_patient_call_admin_api(self):
        pat_token = self.get_token('patient.hung@gmail.com', 'Patient@123')
        res = self.client.post('/api/specialties', json={'name': 'Chuyên Khoa Giả Mạo'}, headers={'Authorization': f'Bearer {pat_token}'})
        self.assertEqual(res.status_code, 403)

    # TC-017: Admin CRUD Doctor/Specialty -> Thành công
    def test_tc017_admin_crud(self):
        admin_token = self.get_token('admin@clinic.com', 'Admin@123')

        # 1. Tạo Specialty
        res_spec = self.client.post('/api/specialties', json={
            'name': 'Chấn thương Chỉnh hình',
            'description': 'Điều trị cơ xương khớp'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_spec.status_code, 201)
        spec_id = res_spec.get_json()['specialty']['id']

        # 2. Tạo Doctor gắn với Specialty vừa tạo
        res_doc = self.client.post('/api/doctors', json={
            'name': 'BS. Trần Văn H',
            'email': 'doctor.h@clinic.com',
            'password': 'Doctor@123',
            'specialty_id': spec_id,
            'phone': '0988112233',
            'experience_years': 8,
            'description': 'Chuyên gia chấn thương chỉnh hình'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_doc.status_code, 201)
        doc_id = res_doc.get_json()['doctor']['id']

        # 3. Sửa Doctor
        res_update = self.client.put(f'/api/doctors/{doc_id}', json={
            'experience_years': 9
        }, headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_update.status_code, 200)
        self.assertEqual(res_update.get_json()['doctor']['experience_years'], 9)

        # 4. Deactivate Doctor
        res_del = self.client.delete(f'/api/doctors/{doc_id}', headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_del.status_code, 200)

if __name__ == '__main__':
    unittest.main()
