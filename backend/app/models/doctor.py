from . import db

class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    specialty_id = db.Column(db.Integer, db.ForeignKey('specialties.id', ondelete='SET NULL'), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    description = db.Column(db.Text, nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)

    # Relationships
    schedules = db.relationship('DoctorSchedule', backref='doctor', lazy='dynamic', cascade='all, delete-orphan')
    appointments = db.relationship('Appointment', backref='doctor', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name if self.user else None,
            'email': self.user.email if self.user else None,
            'phone': self.phone,
            'specialty_id': self.specialty_id,
            'specialty_name': self.specialty.name if self.specialty else 'Chưa phân loại',
            'description': self.description,
            'experience_years': self.experience_years,
            'active': self.active
        }
