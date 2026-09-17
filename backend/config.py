import os
from datetime import timedelta
from dotenv import load_dotenv

# Tải biến môi trường từ .env nếu có
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'clinic_super_secret_jwt_key_2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'clinic_super_secret_jwt_key_2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.environ.get('JWT_EXPIRATION_HOURS', 24)))
    
    # Kết nối MySQL mặc định theo spec MVP, fallback sang SQLite để dễ chạy demo
    # Chuỗi mẫu MySQL: mysql+pymysql://root:password@localhost:3306/clinic_db
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(BASE_DIR, 'clinic.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS config
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
