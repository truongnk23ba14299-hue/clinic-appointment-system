from . import db

# Ảnh đại diện thực tế chuẩn y tế cho từng bác sĩ theo khoa
DOCTOR_AVATARS = {
    1: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',  # BS. CKII Nguyễn Văn An (Nội khoa)
    2: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=800&q=80',  # ThS.BS Đặng Thị Mai (Nhi khoa)
    3: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',  # ThS.BS Lê Minh Cường (Da liễu)
    4: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',  # PGS.TS Phạm Thu Hà (Tim mạch)
    5: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',  # BS. CKI Hoàng Văn Đức (Tai Mũi Họng)
    6: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',  # BS. CKI Vũ Thị Lan (Mắt)
}

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
            'avatar_url': DOCTOR_AVATARS.get(self.id, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'),
            'active': self.active
        }
