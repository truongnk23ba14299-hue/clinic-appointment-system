import os
from flask import Flask, jsonify
from flask_cors import CORS
from .models import db
from .routes import auth_bp, doctor_bp, specialty_bp, schedule_bp, appointment_bp
from .services.seed_service import SeedService
try:
    from config import Config
except ImportError:
    from ..config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Khởi tạo CORS cho phép React frontend kết nối
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Khởi tạo Database
    db.init_app(app)

    # Đăng ký Blueprints theo đúng API Contract trong tài liệu
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(doctor_bp, url_prefix='/api/doctors')
    app.register_blueprint(specialty_bp, url_prefix='/api/specialties')
    app.register_blueprint(schedule_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')

    # Endpoint kiểm tra sức khỏe hệ thống
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok', 'service': 'Clinic Appointment Booking System'}), 200

    # Khởi tạo bảng và seed data ban đầu
    with app.app_context():
        try:
            db.create_all()
            SeedService.seed_data()
        except Exception as e:
            print(f"[create_app] Warning initializing DB: {e}")

    return app
