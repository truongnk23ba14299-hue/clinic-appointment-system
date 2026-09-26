import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from .models import db
from .routes import auth_bp, doctor_bp, specialty_bp, schedule_bp, appointment_bp, user_bp
from .services.seed_service import SeedService
try:
    from config import Config
except ImportError:
    from ..config import Config

def create_app(config_class=Config):
    # Đường dẫn tuyệt đối tới thư mục frontend chứa HTML/CSS/JS thuần
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend'))

    app = Flask(__name__, static_folder=frontend_dir, static_url_path='')
    app.config.from_object(config_class)

    # Khởi tạo CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Khởi tạo Database
    db.init_app(app)

    # Đăng ký Blueprints theo đúng API Contract
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(doctor_bp, url_prefix='/api/doctors')
    app.register_blueprint(specialty_bp, url_prefix='/api/specialties')
    app.register_blueprint(schedule_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    # Endpoint kiểm tra sức khỏe hệ thống
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok', 'service': 'Clinic Appointment Booking System'}), 200

    # Phục vụ file tĩnh HTML/CSS/JS trực tiếp từ thư mục frontend
    @app.route('/')
    def serve_index():
        return send_from_directory(frontend_dir, 'index.html')

    @app.route('/<path:filename>')
    def serve_static(filename):
        # Tránh can thiệp vào các đường dẫn /api
        if filename.startswith('api'):
            return jsonify({'success': False, 'message': 'API endpoint not found'}), 404
        file_path = os.path.join(frontend_dir, filename)
        if os.path.isfile(file_path):
            return send_from_directory(frontend_dir, filename)
        # Nếu có đuôi .html hoặc fallback
        if os.path.isfile(file_path + '.html'):
            return send_from_directory(frontend_dir, filename + '.html')
        return send_from_directory(frontend_dir, 'index.html')

    # Global error handlers trả về JSON thống nhất cho API
    @app.errorhandler(400)
    def bad_request(e):
        msg = getattr(e, 'description', 'Yêu cầu không hợp lệ')
        return jsonify({'success': False, 'message': str(msg)}), 400

    @app.errorhandler(404)
    def not_found(e):
        msg = getattr(e, 'description', 'Không tìm thấy tài nguyên')
        return jsonify({'success': False, 'message': str(msg)}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({'success': False, 'message': 'Phương thức HTTP không được hỗ trợ'}), 405

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({'success': False, 'message': 'Lỗi nội bộ hệ thống máy chủ'}), 500

    # Khởi tạo bảng và seed data ban đầu
    with app.app_context():
        try:
            db.create_all()
            SeedService.seed_data()
        except Exception as e:
            print(f"[create_app] Warning initializing DB: {e}")

    return app
