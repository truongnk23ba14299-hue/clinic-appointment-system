from . import db

class Specialty(db.Model):
    __tablename__ = 'specialties'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, default=True)

    # Relationships
    doctors = db.relationship('Doctor', backref='specialty', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'active': self.active,
            'doctors_count': self.doctors.count() if hasattr(self.doctors, 'count') else 0
        }
