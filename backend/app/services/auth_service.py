from ..models import db, User, Patient
from ..middleware.auth_middleware import generate_token

class AuthService:
    @staticmethod
    def register_patient(data):
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        date_of_birth = data.get('date_of_birth')
        gender = data.get('gender')
        address = data.get('address')

        if not email or not password or not name:
            return {'success': False, 'message': 'Họ tên, email và mật khẩu là bắt buộc'}, 400

        # Kiểm tra email trùng
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {'success': False, 'message': 'Email này đã được đăng ký trong hệ thống'}, 409

        try:
            from datetime import datetime
            dob_val = None
            if date_of_birth:
                try:
                    dob_val = datetime.strptime(date_of_birth, '%Y-%m-%d').date()
                except ValueError:
                    dob_val = None

            # Tạo user với role PATIENT
            user = User(
                name=name,
                email=email,
                role='PATIENT'
            )
            user.set_password(password)
            db.session.add(user)
            db.session.flush()

            # Tạo profile Patient tương ứng
            patient = Patient(
                user_id=user.id,
                phone=phone,
                date_of_birth=dob_val,
                gender=gender,
                address=address
            )
            db.session.add(patient)
            db.session.commit()

            token = generate_token(user)
            return {
                'success': True,
                'message': 'Đăng ký tài khoản thành công',
                'token': token,
                'user': user.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': f'Lỗi hệ thống khi đăng ký: {str(e)}'}, 500

    @staticmethod
    def login(data):
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return {'success': False, 'message': 'Vui lòng cung cấp email và mật khẩu'}, 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {'success': False, 'message': 'Email hoặc mật khẩu không chính xác'}, 401

        token = generate_token(user)
        return {
            'success': True,
            'message': 'Đăng nhập thành công',
            'token': token,
            'user': user.to_dict()
        }, 200
