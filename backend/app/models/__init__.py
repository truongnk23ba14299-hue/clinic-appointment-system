from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .patient import Patient
from .doctor import Doctor
from .specialty import Specialty
from .schedule import DoctorSchedule
from .appointment import Appointment

__all__ = ['db', 'User', 'Patient', 'Doctor', 'Specialty', 'DoctorSchedule', 'Appointment']
