from datetime import datetime, date, time
from ..models import db, Appointment, DoctorSchedule, Doctor, Patient

class AppointmentService:
    @staticmethod
    def book_appointment(patient_user, data):
        """
        Bệnh nhân đặt lịch khám.
        Tuân thủ nghiêm ngặt các business rules:
        - Không đặt trong quá khứ
        - Chống double booking của Doctor
        - Chống double booking của Patient
        - Schedule phải khả dụng và thuộc về Doctor
        """
        doctor_id = data.get('doctor_id')
        schedule_id = data.get('schedule_id')
        reason = data.get('reason', '').strip()

        if not doctor_id or not schedule_id:
            return {'success': False, 'message': 'Thiếu thông tin bác sĩ hoặc khung giờ khám (schedule_id)'}, 400

        # Lấy thông tin patient profile
        patient = Patient.query.filter_by(user_id=patient_user.id).first()
        if not patient:
            return {'success': False, 'message': 'Không tìm thấy hồ sơ bệnh nhân tương ứng'}, 404

        # Lấy schedule
        schedule = db.session.get(DoctorSchedule, schedule_id)
        if not schedule:
            return {'success': False, 'message': 'Khung giờ khám không tồn tại'}, 404

        if schedule.doctor_id != int(doctor_id):
            return {'success': False, 'message': 'Khung giờ khám không thuộc về bác sĩ này'}, 400

        if not schedule.is_available:
            return {'success': False, 'message': 'Khung giờ này đã có người đặt hoặc không khả dụng'}, 400

        appt_date = schedule.date
        start_time_str = schedule.start_time

        # 1. Kiểm tra không đặt lịch trong quá khứ (TC-009)
        today = date.today()
        if appt_date < today:
            return {'success': False, 'message': 'Không thể đặt lịch hẹn trong quá khứ'}, 400

        if appt_date == today:
            # Kiểm tra giờ hiện tại
            now = datetime.now()
            try:
                appt_time_parts = [int(x) for x in start_time_str.split(':')]
                appt_dt = datetime.combine(appt_date, time(appt_time_parts[0], appt_time_parts[1]))
                if appt_dt < now:
                    return {'success': False, 'message': 'Khung giờ này trong ngày hôm nay đã trôi qua'}, 400
            except Exception:
                pass

        # 2. Kiểm tra Doctor double booking (TC-007)
        existing_doc_appt = Appointment.query.filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date == appt_date,
            Appointment.start_time == start_time_str,
            Appointment.status.in_(['PENDING', 'CONFIRMED'])
        ).first()
        if existing_doc_appt:
            return {'success': False, 'message': 'Bác sĩ đã có lịch hẹn khác vào khung giờ này (Doctor double booking)'}, 400

        # 3. Kiểm tra Patient double booking (TC-008)
        existing_pat_appt = Appointment.query.filter(
            Appointment.patient_id == patient.id,
            Appointment.appointment_date == appt_date,
            Appointment.start_time == start_time_str,
            Appointment.status.in_(['PENDING', 'CONFIRMED'])
        ).first()
        if existing_pat_appt:
            return {'success': False, 'message': 'Bạn đã có một lịch hẹn khác vào cùng khung giờ này (Patient double booking)'}, 400

        try:
            # Tạo Appointment với status PENDING (TC-006)
            new_appt = Appointment(
                patient_id=patient.id,
                doctor_id=doctor_id,
                schedule_id=schedule.id,
                appointment_date=appt_date,
                start_time=start_time_str,
                reason=reason,
                status='PENDING'
            )
            # Khóa slot schedule
            schedule.is_available = False

            db.session.add(new_appt)
            db.session.commit()

            return {
                'success': True,
                'message': 'Đặt lịch hẹn thành công',
                'appointment': new_appt.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': f'Lỗi khi lưu lịch hẹn: {str(e)}'}, 500

    @staticmethod
    def cancel_appointment(user, appointment_id):
        """
        Hủy lịch hẹn:
        - Bệnh nhân chỉ được hủy lịch của chính mình (TC-010).
        - Admin có thể hủy lịch bất kỳ.
        - Bác sĩ không được tự hủy qua endpoint này.
        - Lịch COMPLETED không được hủy (TC-012).
        - Khi hủy hợp lệ: status -> CANCELLED, slot schedule -> is_available = True (TC-011).
        """
        appt = db.session.get(Appointment, appointment_id)
        if not appt:
            return {'success': False, 'message': 'Không tìm thấy lịch hẹn'}, 404

        # Quyền hạn
        if user.role == 'PATIENT':
            if not user.patient or appt.patient_id != user.patient.id:
                return {'success': False, 'message': 'Bạn không có quyền hủy lịch hẹn này'}, 403
        elif user.role != 'ADMIN':
            return {'success': False, 'message': 'Chỉ Bệnh nhân hoặc Admin mới có quyền hủy lịch hẹn'}, 403

        # Kiểm tra lịch đã hoàn thành (TC-012)
        if appt.status == 'COMPLETED':
            return {'success': False, 'message': 'Không thể hủy lịch hẹn đã hoàn thành (COMPLETED)'}, 400

        if appt.status == 'CANCELLED':
            return {'success': False, 'message': 'Lịch hẹn này đã bị hủy trước đó'}, 400

        try:
            appt.status = 'CANCELLED'
            # Giải phóng slot trong doctor_schedules (TC-011)
            if appt.schedule:
                appt.schedule.is_available = True

            db.session.commit()
            return {
                'success': True,
                'message': 'Hủy lịch hẹn thành công, khung giờ đã được mở lại',
                'appointment': appt.to_dict()
            }, 200
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': f'Lỗi hệ thống khi hủy lịch: {str(e)}'}, 500

    @staticmethod
    def update_status(user, appointment_id, new_status):
        """
        Thay đổi trạng thái lịch hẹn:
        - Doctor xác nhận: PENDING -> CONFIRMED (TC-013)
        - Doctor hoàn tất khám: CONFIRMED -> COMPLETED (TC-014)
        - Doctor chỉ được sửa lịch hẹn của chính mình.
        - Admin có toàn quyền đổi status.
        """
        appt = db.session.get(Appointment, appointment_id)
        if not appt:
            return {'success': False, 'message': 'Không tìm thấy lịch hẹn'}, 404

        new_status = new_status.upper()
        allowed_statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
        if new_status not in allowed_statuses:
            return {'success': False, 'message': f'Trạng thái không hợp lệ: {new_status}'}, 400

        if user.role == 'DOCTOR':
            if not user.doctor or appt.doctor_id != user.doctor.id:
                return {'success': False, 'message': 'Bác sĩ không được quản lý lịch hẹn của bác sĩ khác'}, 403

            # Kiểm tra luồng trạng thái
            if new_status == 'CONFIRMED' and appt.status != 'PENDING':
                return {'success': False, 'message': 'Chỉ có thể xác nhận lịch hẹn đang ở trạng thái PENDING'}, 400
            if new_status == 'COMPLETED' and appt.status != 'CONFIRMED':
                return {'success': False, 'message': 'Chỉ có thể hoàn thành lịch hẹn đã được CONFIRMED'}, 400
        elif user.role != 'ADMIN':
            return {'success': False, 'message': 'Bạn không có quyền cập nhật trạng thái lịch hẹn'}, 403

        try:
            appt.status = new_status
            # Nếu đổi sang CANCELLED thì giải phóng slot
            if new_status == 'CANCELLED' and appt.schedule:
                appt.schedule.is_available = True
            elif new_status in ['PENDING', 'CONFIRMED'] and appt.schedule:
                appt.schedule.is_available = False

            db.session.commit()
            return {
                'success': True,
                'message': f'Đã cập nhật trạng thái lịch hẹn thành {new_status}',
                'appointment': appt.to_dict()
            }, 200
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': f'Lỗi khi cập nhật trạng thái: {str(e)}'}, 500
