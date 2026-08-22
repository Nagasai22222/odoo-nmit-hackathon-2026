from database import db
from datetime import datetime

class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    date_of_birth = db.Column(db.Date)
    department = db.Column(db.String(100))
    designation = db.Column(db.String(100))
    joining_date = db.Column(db.Date)
    profile_picture = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='employee')
    attendances = db.relationship('Attendance', back_populates='employee', cascade='all, delete-orphan')
    leave_requests = db.relationship('LeaveRequest', back_populates='employee', cascade='all, delete-orphan')
    payrolls = db.relationship('Payroll', back_populates='employee', cascade='all, delete-orphan')
    documents = db.relationship('Document', back_populates='employee', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_id': self.user.employee_id if self.user else None,
            'email': self.user.email if self.user else None,
            'full_name': self.full_name,
            'phone': self.phone,
            'address': self.address,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'department': self.department,
            'designation': self.designation,
            'joining_date': self.joining_date.isoformat() if self.joining_date else None,
            'profile_picture': self.profile_picture,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
