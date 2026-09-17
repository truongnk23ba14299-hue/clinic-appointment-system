from flask import Blueprint, request, jsonify
from sqlalchemy.orm import joinedload
from ..models import db, Doctor, User, Specialty
from ..middleware.auth_middleware import token_required, role_required

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('', methods=['GET'])
def get_doctors():
    search = request.args.get('search', '').strip().lower()
    specialty_id = request.args.get('specialty_id')
    include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'

    # Eager load user and specialty to prevent N+1 query problem
    query = Doctor.query.options(joinedload(Doctor.user), joinedload(Doctor.specialty))

    if not include_inactive:
        query = query.filter(Doctor.active == True)

    if specialty_id and specialty_id.isdigit():
        query = query.filter(Doctor.specialty_id == int(specialty_id))

    doctors = query.all()
    result = []
    for d in doctors:
        doc_dict = d.to_dict()
        # Tìm kiếm theo tên hoặc mô tả
        if search:
            name = (doc_dict['name'] or '').lower()
            desc = (doc_dict['description'] or '').lower()
            spec = (doc_dict['specialty_name'] or '').lower()
            if search not in name and search not in desc and search not in spec:
                continue
        result.append(doc_dict)

    return jsonify({
        'success': True,
        'count': len(result),
        'doctors': result
    }), 200

@doctor_bp.route('/<int:doctor_id>', methods=['GET'])
def get_doctor_detail(doctor_id):
    doctor = Doctor.query.options(joinedload(Doctor.user), joinedload(Doctor.specialty)).filter_by(id=doctor_id).first()
    if not doctor:
        return jsonify({'success': False, 'message': 'Không tìm thấy bác sĩ'}), 404

    return jsonify({
        'success': True,
        'doctor': doctor.to_dict()
    }), 200

@doctor_bp.route('', methods=['POST'])
@role_required('ADMIN')
def create_doctor():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', 'Doctor@123')
    specialty_id = data.get('specialty_id')
    phone = data.get('phone', '')
    description = data.get('description', '')
    experience_years = data.get('experience_years', 0)

    if not name or not email:
        return jsonify({'success': False, 'message': 'Tên và email bác sĩ là bắt buộc'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Email tài khoản đã tồn tại'}), 409

    try:
        user = User(name=name, email=email, role='DOCTOR')
        user.set_password(password)
        db.session.add(user)
        db.session.flush()

        doctor = Doctor(
            user_id=user.id,
            specialty_id=specialty_id if specialty_id else None,
            phone=phone,
            description=description,
            experience_years=int(experience_years) if experience_years else 0,
            active=True
        )
        db.session.add(doctor)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Thêm bác sĩ thành công',
            'doctor': doctor.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi tạo bác sĩ: {str(e)}'}), 500

@doctor_bp.route('/<int:doctor_id>', methods=['PUT'])
@role_required('ADMIN')
def update_doctor(doctor_id):
    doctor = db.session.get(Doctor, doctor_id)
    if not doctor:
        return jsonify({'success': False, 'message': 'Không tìm thấy bác sĩ'}), 404

    data = request.get_json() or {}
    try:
        if 'name' in data and doctor.user:
            doctor.user.name = data['name']
        if 'specialty_id' in data:
            doctor.specialty_id = data['specialty_id']
        if 'phone' in data:
            doctor.phone = data['phone']
        if 'description' in data:
            doctor.description = data['description']
        if 'experience_years' in data:
            doctor.experience_years = int(data['experience_years'])
        if 'active' in data:
            doctor.active = bool(data['active'])

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Cập nhật thông tin bác sĩ thành công',
            'doctor': doctor.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi cập nhật: {str(e)}'}), 500

@doctor_bp.route('/<int:doctor_id>', methods=['DELETE'])
@role_required('ADMIN')
def delete_doctor(doctor_id):
    doctor = db.session.get(Doctor, doctor_id)
    if not doctor:
        return jsonify({'success': False, 'message': 'Không tìm thấy bác sĩ'}), 404

    # Deactivate / xóa mềm
    try:
        doctor.active = False
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Đã vô hiệu hóa bác sĩ thành công'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi: {str(e)}'}), 500
