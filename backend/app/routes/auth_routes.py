from flask import Blueprint, request, jsonify
from ..services.auth_service import AuthService
from ..middleware.auth_middleware import token_required

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    res, status_code = AuthService.register_patient(data)
    return jsonify(res), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    res, status_code = AuthService.login(data)
    return jsonify(res), status_code

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    user = request.current_user
    user_data = user.to_dict()
    if user.role == 'PATIENT' and user.patient:
        user_data['patient_profile'] = user.patient.to_dict()
    elif user.role == 'DOCTOR' and user.doctor:
        user_data['doctor_profile'] = user.doctor.to_dict()
        
    return jsonify({
        'success': True,
        'user': user_data
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user = request.current_user
    data = request.get_json() or {}
    
    name = data.get('name')
    if name:
        user.name = name
        
    if user.role == 'PATIENT' and user.patient:
        if 'phone' in data:
            user.patient.phone = data['phone']
        if 'address' in data:
            user.patient.address = data['address']
        if 'gender' in data:
            user.patient.gender = data['gender']
        if 'date_of_birth' in data and data['date_of_birth']:
            from datetime import datetime
            try:
                user.patient.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except ValueError:
                pass
                
    from ..models import db
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Cập nhật thông tin thành công',
        'user': user.to_dict()
    }), 200
