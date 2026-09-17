import jwt
from datetime import datetime, timezone
from functools import wraps
from flask import request, jsonify, current_app
from ..models import db, User

def generate_token(user):
    """Tạo JWT token chứa user_id, email, role"""
    now = datetime.now(timezone.utc)
    expires = now + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
    
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'iat': now,
        'exp': expires
    }
    
    # pyjwt 2.x returns string
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    """Decorator kiểm tra và xác thực JWT token từ Authorization header"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Thiếu Access Token trong header'}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'success': False, 'message': 'Định dạng Authorization header phải là Bearer <token>'}), 401
        
        token = parts[1]
        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            user = db.session.get(User, payload['user_id'])
            if not user:
                return jsonify({'success': False, 'message': 'Người dùng không tồn tại hoặc đã bị xóa'}), 401
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token đã hết hạn, vui lòng đăng nhập lại'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Token không hợp lệ'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': f'Lỗi xác thực: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated

def role_required(*allowed_roles):
    """Decorator phân quyền người dùng dựa trên role (ADMIN, DOCTOR, PATIENT)"""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(*args, **kwargs):
            user = getattr(request, 'current_user', None)
            if not user or user.role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'message': f'Truy cập bị từ chối. Quyền yêu cầu: {", ".join(allowed_roles)}'
                }), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
