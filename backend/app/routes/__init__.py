from .auth_routes import auth_bp
from .doctor_routes import doctor_bp
from .specialty_routes import specialty_bp
from .schedule_routes import schedule_bp
from .appointment_routes import appointment_bp

__all__ = ['auth_bp', 'doctor_bp', 'specialty_bp', 'schedule_bp', 'appointment_bp']
