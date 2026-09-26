from flask import Blueprint, request, jsonify
from sqlalchemy.orm import joinedload
from ..models import db, User, Patient, Doctor, Specialty
from ..middleware.auth_middleware import role_required

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('', methods=['GET'])
@role_required('ADMIN')
def get_users():
    """Admin lấy danh sách người dùng toàn hệ thống (hỗ trợ tìm kiếm & lọc theo role)"""
    search = request.args.get('search', '').strip().lower()
    role_filter = request.args.get('role', '').strip().upper()

    query = User.query.options(joinedload(User.patient), joinedload(User.doctor))

    if role_filter:
        query = query.filter_by(role=role_filter)

    users = query.order_by(User.id.desc()).all()
    results = []

    for u in users:
        u_dict = u.to_dict()
        if search:
            name = (u.name or '').lower()
            email = (u.email or '').lower()
            phone = (u_dict.get('phone') or '').lower()
            if search not in name and search not in email and search not in phone:
                continue
        results.append(u_dict)

    return jsonify({
        'success': True,
        'count': len(results),
        'users': results
    }), 200

@user_bp.route('/<int:user_id>', methods=['GET'])
@role_required('ADMIN')
def get_user_detail(user_id):
    """Admin xem chi tiết 1 người dùng"""
    user = User.query.options(joinedload(User.patient), joinedload(User.doctor)).filter_by(id=user_id).first()
    if not user:
        return jsonify({'success': False, 'message': 'Không tìm thấy người dùng'}), 404

    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200

@user_bp.route('', methods=['POST'])
@role_required('ADMIN')
def create_user():
    """Admin tạo mới người dùng (PATIENT, DOCTOR, ADMIN)"""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '123456')
    role = data.get('role', 'PATIENT').strip().upper()
    phone = data.get('phone', '').strip()
    specialty_id = data.get('specialty_id')

    if not name or not email:
        return jsonify({'success': False, 'message': 'Họ tên và email là bắt buộc'}), 400

    if role not in ['PATIENT', 'DOCTOR', 'ADMIN']:
        return jsonify({'success': False, 'message': f'Vai trò không hợp lệ: {role}'}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({'success': False, 'message': 'Email tài khoản đã tồn tại'}), 409

    try:
        new_user = User(name=name, email=email, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.flush()

        if role == 'PATIENT':
            patient = Patient(user_id=new_user.id, phone=phone)
            db.session.add(patient)
        elif role == 'DOCTOR':
            spec_id = int(specialty_id) if specialty_id else None
            doctor = Doctor(user_id=new_user.id, phone=phone, specialty_id=spec_id, active=True)
            db.session.add(doctor)

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Tạo tài khoản người dùng thành công',
            'user': new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi tạo tài khoản: {str(e)}'}), 500

@user_bp.route('/<int:user_id>', methods=['PUT'])
@role_required('ADMIN')
def update_user_full(user_id):
    """Admin cập nhật toàn bộ (Full Update) thông tin người dùng"""
    user = User.query.options(joinedload(User.patient), joinedload(User.doctor)).filter_by(id=user_id).first()
    if not user:
        return jsonify({'success': False, 'message': 'Không tìm thấy người dùng'}), 404

    data = request.get_json() or {}
    new_name = data.get('name')
    new_email = data.get('email')
    new_role = data.get('role')
    new_password = data.get('password')
    new_phone = data.get('phone')
    new_specialty_id = data.get('specialty_id')

    if new_name is not None and str(new_name).strip():
        user.name = str(new_name).strip()

    if new_email is not None and str(new_email).strip():
        clean_email = str(new_email).strip().lower()
        if clean_email != user.email:
            existing = User.query.filter(User.email == clean_email, User.id != user.id).first()
            if existing:
                return jsonify({'success': False, 'message': 'Email này đã được sử dụng bởi người dùng khác'}), 409
            user.email = clean_email

    if new_password and str(new_password).strip():
        user.set_password(str(new_password).strip())

    if new_role and str(new_role).strip().upper() in ['PATIENT', 'DOCTOR', 'ADMIN']:
        user.role = str(new_role).strip().upper()

    # Cập nhật thông tin phụ thuộc theo role
    if user.role == 'PATIENT':
        if not user.patient:
            user.patient = Patient(user_id=user.id)
        if new_phone is not None:
            user.patient.phone = str(new_phone).strip()
    elif user.role == 'DOCTOR':
        if not user.doctor:
            user.doctor = Doctor(user_id=user.id, active=True)
        if new_phone is not None:
            user.doctor.phone = str(new_phone).strip()
        if new_specialty_id is not None:
            try:
                user.doctor.specialty_id = int(new_specialty_id) if new_specialty_id else None
            except ValueError:
                pass

    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Cập nhật thông tin người dùng thành công',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi khi cập nhật người dùng: {str(e)}'}), 500

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@role_required('ADMIN')
def delete_user(user_id):
    """Admin xóa người dùng khỏi hệ thống"""
    if request.current_user.id == user_id:
        return jsonify({'success': False, 'message': 'Không thể tự xóa tài khoản của chính mình'}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'success': False, 'message': 'Không tìm thấy người dùng'}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Đã xóa người dùng thành công'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi khi xóa người dùng: {str(e)}'}), 500
