from . import db

class DoctorSchedule(db.Model):
    __tablename__ = 'doctor_schedules'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(10), nullable=False) # e.g. "08:00"
    end_time = db.Column(db.String(10), nullable=False)   # e.g. "08:30"
    is_available = db.Column(db.Boolean, default=True)

    # Relationships
    appointment = db.relationship('Appointment', backref='schedule', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'doctor_id': self.doctor_id,
            'doctor_name': self.doctor.user.name if (self.doctor and self.doctor.user) else None,
            'specialty_name': self.doctor.specialty.name if (self.doctor and self.doctor.specialty) else None,
            'date': self.date.strftime('%Y-%m-%d') if self.date else None,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'is_available': self.is_available
        }
