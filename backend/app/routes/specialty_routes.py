from flask import Blueprint, request, jsonify
from ..models import db, Specialty
from ..middleware.auth_middleware import role_required

specialty_bp = Blueprint('specialty_bp', __name__)

@specialty_bp.route('', methods=['GET'])
def get_specialties():
    include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'
    query = Specialty.query
    if not include_inactive:
        query = query.filter(Specialty.active == True)
    
    specs = query.all()
    return jsonify({
        'success': True,
        'count': len(specs),
        'specialties': [s.to_dict() for s in specs]
    }), 200

@specialty_bp.route('', methods=['POST'])
@role_required('ADMIN')
def create_specialty():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    description = data.get('description', '')

    if not name:
        return jsonify({'success': False, 'message': 'Tên chuyên khoa là bắt buộc'}), 400

    existing = Specialty.query.filter_by(name=name).first()
    if existing:
        return jsonify({'success': False, 'message': 'Chuyên khoa này đã tồn tại'}), 409

    try:
        new_spec = Specialty(name=name, description=description, active=True)
        db.session.add(new_spec)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Thêm chuyên khoa mới thành công',
            'specialty': new_spec.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi tạo chuyên khoa: {str(e)}'}), 500

@specialty_bp.route('/<int:specialty_id>', methods=['PUT'])
@role_required('ADMIN')
def update_specialty(specialty_id):
    spec = db.session.get(Specialty, specialty_id)
    if not spec:
        return jsonify({'success': False, 'message': 'Không tìm thấy chuyên khoa'}), 404

    data = request.get_json() or {}
    try:
        if 'name' in data and data['name']:
            spec.name = data['name'].strip()
        if 'description' in data:
            spec.description = data['description']
        if 'active' in data:
            spec.active = bool(data['active'])

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Cập nhật chuyên khoa thành công',
            'specialty': spec.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi cập nhật: {str(e)}'}), 500

@specialty_bp.route('/<int:specialty_id>', methods=['DELETE'])
@role_required('ADMIN')
def delete_specialty(specialty_id):
    spec = db.session.get(Specialty, specialty_id)
    if not spec:
        return jsonify({'success': False, 'message': 'Không tìm thấy chuyên khoa'}), 404

    try:
        spec.active = False
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Đã vô hiệu hóa chuyên khoa thành công'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Lỗi: {str(e)}'}), 500
