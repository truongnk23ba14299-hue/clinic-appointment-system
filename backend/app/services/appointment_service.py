from datetime import datetime, date, time
from ..models import db, Appointment, DoctorSchedule, Doctor, Patient

class AppointmentService:
    @staticmethod
    def book_appointment(patient_user, data):
        """
        Bệnh nhân đặt lịch khám:
        - Hỗ trợ cả 2 hình thức:
          1. Tự điền ngày giờ: truyền 'appointment_date' (hoặc 'date') và 'start_time' (hoặc 'time')
          2. Chọn slot có sẵn: truyền 'schedule_id'
        - Ràng buộc:
          - Không đặt ngày/giờ trong quá khứ
          - Chống Doctor double booking
          - Chống Patient double booking
        """
        doctor_id = data.get('doctor_id')
        schedule_id = data.get('schedule_id')
        reason = data.get('reason', '').strip()

        if not doctor_id:
            return {'success': False, 'message': 'Thiếu thông tin bác sĩ (doctor_id)'}, 400

        try:
            doctor_id = int(doctor_id)
        except ValueError:
            return {'success': False, 'message': 'doctor_id không hợp lệ'}, 400

        doctor = db.session.get(Doctor, doctor_id)
        if not doctor:
            return {'success': False, 'message': 'Bác sĩ không tồn tại'}, 404

        patient = Patient.query.filter_by(user_id=patient_user.id).first()
        if not patient:
            return {'success': False, 'message': 'Không tìm thấy hồ sơ bệnh nhân tương ứng'}, 404

        schedule = None
        if schedule_id:
            schedule = db.session.get(DoctorSchedule, schedule_id)
            if not schedule:
                return {'success': False, 'message': 'Khung giờ khám không tồn tại'}, 404
            if schedule.doctor_id != doctor_id:
                return {'success': False, 'message': 'Khung giờ khám không thuộc về bác sĩ này'}, 400
            if not schedule.is_available:
                return {'success': False, 'message': 'Khung giờ này đã có người đặt hoặc không khả dụng'}, 400
            appt_date = schedule.date
            start_time_str = schedule.start_time
        else:
            date_val = data.get('appointment_date') or data.get('date')
            time_val = data.get('start_time') or data.get('time')
            if not date_val or not time_val:
                return {'success': False, 'message': 'Vui lòng cung cấp ngày khám và giờ khám'}, 400
            
            if isinstance(date_val, str):
                try:
                    appt_date = datetime.strptime(date_val.strip(), '%Y-%m-%d').date()
                except ValueError:
                    return {'success': False, 'message': 'Định dạng ngày khám không hợp lệ (YYYY-MM-DD)'}, 400
            else:
                appt_date = date_val

            start_time_str = str(time_val).strip()

        # 1. Kiểm tra không đặt trong quá khứ
        today = date.today()
        if appt_date < today:
            return {'success': False, 'message': 'Không thể đặt lịch hẹn trong quá khứ'}, 400

        if appt_date == today:
            now = datetime.now()
            try:
                appt_time_parts = [int(x) for x in start_time_str.split(':')]
                appt_dt = datetime.combine(appt_date, time(appt_time_parts[0], appt_time_parts[1]))
                if appt_dt < now:
                    return {'success': False, 'message': 'Khung giờ này trong ngày hôm nay đã trôi qua'}, 400
            except Exception:
                pass

        # 2. Kiểm tra Doctor double booking
        existing_doc_appt = Appointment.query.filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date == appt_date,
            Appointment.start_time == start_time_str,
            Appointment.status.in_(['PENDING', 'CONFIRMED'])
        ).first()
        if existing_doc_appt:
            return {'success': False, 'message': 'Bác sĩ đã có lịch hẹn khác vào khung giờ này (Doctor double booking)'}, 400

        # 3. Kiểm tra Patient double booking
        existing_pat_appt = Appointment.query.filter(
            Appointment.patient_id == patient.id,
            Appointment.appointment_date == appt_date,
            Appointment.start_time == start_time_str,
            Appointment.status.in_(['PENDING', 'CONFIRMED'])
        ).first()
        if existing_pat_appt:
            return {'success': False, 'message': 'Bạn đã có một lịch hẹn khác vào cùng khung giờ này (Patient double booking)'}, 400

        try:
            new_appt = Appointment(
                patient_id=patient.id,
                doctor_id=doctor_id,
                schedule_id=schedule.id if schedule else None,
                appointment_date=appt_date,
                start_time=start_time_str,
                reason=reason,
                status='PENDING'
            )
            if schedule:
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
    def update_appointment_full(user, appointment_id, data):
        """
        Cập nhật toàn bộ (Full Update) lịch hẹn:
        - Bệnh nhân: Cập nhật ngày, giờ, lý do khám (nếu chưa hoàn tất hoặc đã hủy)
        - Bác sĩ: Cập nhật trạng thái (PENDING, CONFIRMED, COMPLETED), ngày, giờ, lý do
        - Admin: Toàn quyền cập nhật bất kỳ trường nào
        """
        appt = db.session.get(Appointment, appointment_id)
        if not appt:
            return {'success': False, 'message': 'Không tìm thấy lịch hẹn'}, 404

        # Phân quyền cập nhật
        if user.role == 'PATIENT':
            if not user.patient or appt.patient_id != user.patient.id:
                return {'success': False, 'message': 'Bạn không có quyền sửa lịch hẹn này'}, 403
            if appt.status in ['COMPLETED', 'CANCELLED']:
                return {'success': False, 'message': f'Không thể sửa lịch hẹn đang ở trạng thái {appt.status}'}, 400
        elif user.role == 'DOCTOR':
            if not user.doctor or appt.doctor_id != user.doctor.id:
                return {'success': False, 'message': 'Bác sĩ không có quyền sửa lịch hẹn của bác sĩ khác'}, 403
        elif user.role != 'ADMIN':
            return {'success': False, 'message': 'Vai trò không hợp lệ'}, 403

        # Lấy thông tin mới từ request payload (full update)
        new_date_str = data.get('appointment_date') or data.get('date')
        new_time_str = data.get('start_time') or data.get('time')
        new_reason = data.get('reason')
        new_status = data.get('status')
        new_doctor_id = data.get('doctor_id')

        # Xử lý cập nhật bác sĩ (Admin hoặc Patient)
        target_doctor_id = appt.doctor_id
        if new_doctor_id and user.role in ['ADMIN', 'PATIENT']:
            try:
                target_doctor_id = int(new_doctor_id)
                if not db.session.get(Doctor, target_doctor_id):
                    return {'success': False, 'message': 'Bác sĩ mới không tồn tại'}, 404
                appt.doctor_id = target_doctor_id
            except ValueError:
                pass

        # Xử lý ngày giờ mới nếu có thay đổi
        target_date = appt.appointment_date
        target_time = appt.start_time
        time_changed = False

        if new_date_str:
            try:
                parsed_date = datetime.strptime(str(new_date_str).strip(), '%Y-%m-%d').date()
                if parsed_date != target_date:
                    target_date = parsed_date
                    time_changed = True
            except ValueError:
                return {'success': False, 'message': 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'}, 400

        if new_time_str and str(new_time_str).strip() != target_time:
            target_time = str(new_time_str).strip()
            time_changed = True

        if time_changed:
            today = date.today()
            if target_date < today:
                return {'success': False, 'message': 'Không thể đổi lịch hẹn sang ngày trong quá khứ'}, 400

            # Kiểm tra xung đột bác sĩ
            conflict_doc = Appointment.query.filter(
                Appointment.id != appt.id,
                Appointment.doctor_id == target_doctor_id,
                Appointment.appointment_date == target_date,
                Appointment.start_time == target_time,
                Appointment.status.in_(['PENDING', 'CONFIRMED'])
            ).first()
            if conflict_doc:
                return {'success': False, 'message': 'Bác sĩ đã có lịch hẹn khác vào khung giờ mới này'}, 400

            # Kiểm tra xung đột bệnh nhân
            conflict_pat = Appointment.query.filter(
                Appointment.id != appt.id,
                Appointment.patient_id == appt.patient_id,
                Appointment.appointment_date == target_date,
                Appointment.start_time == target_time,
                Appointment.status.in_(['PENDING', 'CONFIRMED'])
            ).first()
            if conflict_pat:
                return {'success': False, 'message': 'Bệnh nhân đã có một lịch khám khác vào khung giờ mới này'}, 400

            appt.appointment_date = target_date
            appt.start_time = target_time

        # Xử lý lý do khám
        if new_reason is not None:
            appt.reason = str(new_reason).strip()

        # Xử lý trạng thái (Status)
        if new_status:
            status_upper = str(new_status).strip().upper()
            allowed = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
            if status_upper not in allowed:
                return {'success': False, 'message': f'Trạng thái không hợp lệ: {status_upper}'}, 400

            # Bệnh nhân không được tự đổi status sang CONFIRMED/COMPLETED
            if user.role == 'PATIENT' and status_upper in ['CONFIRMED', 'COMPLETED']:
                return {'success': False, 'message': 'Bệnh nhân không có quyền duyệt trạng thái lịch khám'}, 403

            # Nếu chuyển sang CANCELLED thì mở lại schedule slot nếu có
            if status_upper == 'CANCELLED' and appt.schedule:
                appt.schedule.is_available = True
            elif status_upper in ['PENDING', 'CONFIRMED'] and appt.schedule:
                appt.schedule.is_available = False

            appt.status = status_upper

        try:
            db.session.commit()
            return {
                'success': True,
                'message': 'Cập nhật lịch hẹn thành công',
                'appointment': appt.to_dict()
            }, 200
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': f'Lỗi khi cập nhật lịch hẹn: {str(e)}'}, 500

    @staticmethod
    def cancel_appointment(user, appointment_id):
        """
        Hủy/Xóa lịch hẹn:
        - Bệnh nhân chỉ hủy lịch của mình
        - Bác sĩ hủy lịch được phân công
        - Admin hủy lịch bất kỳ
        - Lịch COMPLETED không được hủy
        """
        appt = db.session.get(Appointment, appointment_id)
        if not appt:
            return {'success': False, 'message': 'Không tìm thấy lịch hẹn'}, 404

        if user.role == 'PATIENT':
            if not user.patient or appt.patient_id != user.patient.id:
                return {'success': False, 'message': 'Bạn không có quyền hủy lịch hẹn này'}, 403
        elif user.role == 'DOCTOR':
            if not user.doctor or appt.doctor_id != user.doctor.id:
                return {'success': False, 'message': 'Bác sĩ không có quyền hủy lịch hẹn của bác sĩ khác'}, 403

        if appt.status == 'COMPLETED':
            return {'success': False, 'message': 'Không thể hủy lịch hẹn đã hoàn thành (COMPLETED)'}, 400

        try:
            appt.status = 'CANCELLED'
            if appt.schedule:
                appt.schedule.is_available = True

            db.session.commit()
            return {
                'success': True,
                'message': 'Hủy lịch hẹn thành công',
                'appointment': appt.to_dict()
            }, 200
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': f'Lỗi hệ thống khi hủy lịch: {str(e)}'}, 500

    @staticmethod
    def update_status(user, appointment_id, new_status):
        """Tương thích ngược với các endpoint cũ: cập nhật trạng thái lịch hẹn"""
        return AppointmentService.update_appointment_full(user, appointment_id, {'status': new_status})
