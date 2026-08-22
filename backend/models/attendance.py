from database import db
from datetime import datetime

class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    check_in = db.Column(db.Time)
    check_out = db.Column(db.Time)
    status = db.Column(db.String(20), nullable=False) # Present, Absent, Half-day, Leave
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Unique constraint to prevent duplicate attendance per day per employee
    __table_args__ = (
        db.UniqueConstraint('employee_id', 'date', name='unique_attendance_per_day'),
    )

    # Relationships
    employee = db.relationship('Employee', back_populates='attendances')

    def to_dict(self):
        working_hours = None
        if self.check_in and self.check_out:
            # Calculate working hours (simple time difference)
            # Combine with a dummy date to do subtraction
            dummy_date = datetime(2000, 1, 1)
            ci = datetime.combine(dummy_date, self.check_in)
            co = datetime.combine(dummy_date, self.check_out)
            diff = co - ci
            hours, remainder = divmod(diff.seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            working_hours = f"{hours}h {minutes}m"

        return {
            'id': self.id,
            'employee_id': self.employee.user.employee_id if self.employee and self.employee.user else None,
            'employee_name': self.employee.full_name if self.employee else None,
            'date': self.date.isoformat() if self.date else None,
            'check_in': self.check_in.strftime('%I:%M %p') if self.check_in else None,
            'check_out': self.check_out.strftime('%I:%M %p') if self.check_out else None,
            'working_hours': working_hours,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
