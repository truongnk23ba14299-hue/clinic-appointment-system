from datetime import datetime, timezone
from . import db

def utc_now():
    return datetime.now(timezone.utc)

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id', ondelete='CASCADE'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id', ondelete='CASCADE'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('doctor_schedules.id', ondelete='CASCADE'), nullable=True)
    appointment_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(10), nullable=False)
    reason = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='PENDING') # PENDING, CONFIRMED, COMPLETED, CANCELLED
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'patient_name': self.patient.user.name if (self.patient and self.patient.user) else None,
            'patient_phone': self.patient.phone if self.patient else None,
            'doctor_id': self.doctor_id,
            'doctor_name': self.doctor.user.name if (self.doctor and self.doctor.user) else None,
            'specialty_name': self.doctor.specialty.name if (self.doctor and self.doctor.specialty) else None,
            'schedule_id': self.schedule_id,
            'appointment_date': self.appointment_date.strftime('%Y-%m-%d') if self.appointment_date else None,
            'start_time': self.start_time,
            'reason': self.reason,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
