from datetime import datetime, date
from flask import Blueprint, request, jsonify
from ..models import db, DoctorSchedule, Doctor
from ..middleware.auth_middleware import token_required, role_required

schedule_bp = Blueprint('schedule_bp', __name__)

@schedule_bp.route('/doctors/<int:doctor_id>/schedules', methods=['GET'])
def get_doctor_schedules(doctor_id):
    """Lấy danh sách lịch khám của bác sĩ. Mặc định chỉ lấy các slot khả dụng (is_available=True) (TC-005)"""
    only_available = request.args.get('available_only', 'true').lower() == 'true'
    date_filter = request.args.get('date')

    query = DoctorSchedule.query.filter_by(doctor_id=doctor_id)

    if only_available:
        query = query.filter_by(is_available=True)

    if date_filter:
        try:
            d_val = datetime.strptime(date_filter, '%Y-%m-%d').date()
            query = query.filter_by(date=d_val)
        except ValueError:
            pass

    schedules = query.order_by(DoctorSchedule.date.asc(), DoctorSchedule.start_time.asc()).all()

    return jsonify({
        'success': True,
        'count': len(schedules),
        'schedules': [s.to_dict() for s in schedules]
    }), 200

@schedule_bp.route('/schedules', methods=['POST'])
@role_required('DOCTOR')
def create_schedule():
    """Bác sĩ tạo khung giờ làm việc của chính mình"""
    doctor = request.current_user.doctor
    if not doctor:
        return jsonify({'success': False, 'message': 'Tài khoản chưa được kích hoạt hồ sơ Bác sĩ'}), 403

    data = request.get_json() or {}
    date_str = data.get('date')
    start_time = data.get('start_time', '').strip()
    end_time = data.get('end_time', '').strip()

    if not date_str or not start_time or not end_time:
        return jsonify({'success': False, 'message': 'Vui lòng cung cấp đầy đủ ngày khám, giờ bắt đầu và giờ kết thúc'}), 400

    try:
        schedule_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'success': False, 'message': 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'}), 400

    # Kiểm tra trùng lịch của chính bác sĩ
    existing = DoctorSchedule.query.filter_by(
        doctor_id=doctor.id,
        date=schedule_date,
        start_time=start_time
    ).first()
    if existing:
        return jsonify({'success': False, 'message': 'Khung giờ này đã được tạo trong lịch làm việc'}), 409

    try:
        new_schedule = DoctorSchedule(
            doctor_id=doctor.id,
            date=schedule_date,
            start_time=start_time,
            end_time=end_time,
            is_available=True
        )
        db.session.add(new_schedule)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Thêm lịch làm việc thành công',
            'schedule': new_schedule.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi tạo lịch: {str(e)}'}), 500

@schedule_bp.route('/schedules/<int:schedule_id>', methods=['PUT'])
@role_required('DOCTOR')
def update_schedule(schedule_id):
    """Bác sĩ sửa lịch của mình. Nếu sửa lịch người khác -> 403 (TC-015)"""
    doctor = request.current_user.doctor
    if not doctor:
        return jsonify({'success': False, 'message': 'Không tìm thấy hồ sơ bác sĩ'}), 403

    schedule = db.session.get(DoctorSchedule, schedule_id)
    if not schedule:
        return jsonify({'success': False, 'message': 'Không tìm thấy lịch làm việc'}), 404

    # Kiểm tra quyền sở hữu (TC-015)
    if schedule.doctor_id != doctor.id:
        return jsonify({'success': False, 'message': 'Bác sĩ không có quyền sửa lịch của bác sĩ khác'}), 403

    data = request.get_json() or {}
    try:
        if 'date' in data and data['date']:
            schedule.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'start_time' in data and data['start_time']:
            schedule.start_time = data['start_time'].strip()
        if 'end_time' in data and data['end_time']:
            schedule.end_time = data['end_time'].strip()
        if 'is_available' in data:
            schedule.is_available = bool(data['is_available'])

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Cập nhật lịch làm việc thành công',
            'schedule': schedule.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi: {str(e)}'}), 500

@schedule_bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@role_required('DOCTOR')
def delete_schedule(schedule_id):
    """Bác sĩ xóa lịch của mình. Nếu xóa lịch người khác -> 403 (TC-015)"""
    doctor = request.current_user.doctor
    if not doctor:
        return jsonify({'success': False, 'message': 'Không tìm thấy hồ sơ bác sĩ'}), 403

    schedule = db.session.get(DoctorSchedule, schedule_id)
    if not schedule:
        return jsonify({'success': False, 'message': 'Không tìm thấy lịch làm việc'}), 404

    # Kiểm tra quyền sở hữu (TC-015)
    if schedule.doctor_id != doctor.id:
        return jsonify({'success': False, 'message': 'Bác sĩ không có quyền xóa lịch của bác sĩ khác'}), 403

    try:
        db.session.delete(schedule)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Đã xóa khung giờ làm việc thành công'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi: {str(e)}'}), 500
