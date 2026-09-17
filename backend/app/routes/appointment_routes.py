from flask import Blueprint, request, jsonify
from ..models import db, Appointment
from ..services.appointment_service import AppointmentService
from ..middleware.auth_middleware import token_required, role_required

appointment_bp = Blueprint('appointment_bp', __name__)

@appointment_bp.route('', methods=['POST'])
@role_required('PATIENT')
def create_appointment():
    """Bệnh nhân đặt lịch khám (TC-006, TC-007, TC-008, TC-009)"""
    data = request.get_json() or {}
    res, status_code = AppointmentService.book_appointment(request.current_user, data)
    return jsonify(res), status_code

@appointment_bp.route('', methods=['GET'])
@token_required
def get_appointments():
    """
    Xem danh sách lịch hẹn theo Role:
    - PATIENT: Chỉ xem của mình (TC-010)
    - DOCTOR: Chỉ xem của mình
    - ADMIN: Xem tất cả
    """
    user = request.current_user
    status_filter = request.args.get('status')
    date_filter = request.args.get('date')

    query = Appointment.query

    if user.role == 'PATIENT':
        if not user.patient:
            return jsonify({'success': True, 'count': 0, 'appointments': []}), 200
        query = query.filter_by(patient_id=user.patient.id)
    elif user.role == 'DOCTOR':
        if not user.doctor:
            return jsonify({'success': True, 'count': 0, 'appointments': []}), 200
        query = query.filter_by(doctor_id=user.doctor.id)
    elif user.role == 'ADMIN':
        # Admin có thể lọc theo doctor_id hoặc patient_id
        doc_id = request.args.get('doctor_id')
        pat_id = request.args.get('patient_id')
        if doc_id and doc_id.isdigit():
            query = query.filter_by(doctor_id=int(doc_id))
        if pat_id and pat_id.isdigit():
            query = query.filter_by(patient_id=int(pat_id))
    else:
        return jsonify({'success': False, 'message': 'Vai trò không hợp lệ'}), 403

    if status_filter:
        query = query.filter_by(status=status_filter.upper())

    if date_filter:
        from datetime import datetime
        try:
            d_val = datetime.strptime(date_filter, '%Y-%m-%d').date()
            query = query.filter_by(appointment_date=d_val)
        except ValueError:
            pass

    appts = query.order_by(Appointment.appointment_date.desc(), Appointment.start_time.asc()).all()

    return jsonify({
        'success': True,
        'count': len(appts),
        'appointments': [a.to_dict() for a in appts]
    }), 200

@appointment_bp.route('/<int:appointment_id>', methods=['GET'])
@token_required
def get_appointment_detail(appointment_id):
    user = request.current_user
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({'success': False, 'message': 'Không tìm thấy lịch hẹn'}), 404

    # Kiểm tra quyền xem
    if user.role == 'PATIENT':
        if not user.patient or appt.patient_id != user.patient.id:
            return jsonify({'success': False, 'message': 'Không có quyền xem lịch hẹn này'}), 403
    elif user.role == 'DOCTOR':
        if not user.doctor or appt.doctor_id != user.doctor.id:
            return jsonify({'success': False, 'message': 'Không có quyền xem lịch hẹn này'}), 403

    return jsonify({
        'success': True,
        'appointment': appt.to_dict()
    }), 200

@appointment_bp.route('/<int:appointment_id>/status', methods=['PUT'])
@token_required
def update_appointment_status(appointment_id):
    """
    Bác sĩ hoặc Admin cập nhật trạng thái:
    - Bác sĩ: Confirm (PENDING -> CONFIRMED), Complete (CONFIRMED -> COMPLETED)
    - Admin: Toàn quyền đổi status
    """
    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({'success': False, 'message': 'Thiếu tham số status mới'}), 400

    res, status_code = AppointmentService.update_status(request.current_user, appointment_id, new_status)
    return jsonify(res), status_code

@appointment_bp.route('/<int:appointment_id>', methods=['DELETE'])
@token_required
def cancel_appointment(appointment_id):
    """Bệnh nhân hoặc Admin hủy lịch hẹn hợp lệ (TC-011, TC-012)"""
    res, status_code = AppointmentService.cancel_appointment(request.current_user, appointment_id)
    return jsonify(res), status_code
