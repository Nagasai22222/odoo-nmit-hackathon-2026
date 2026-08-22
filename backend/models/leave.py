from database import db
from datetime import datetime

class LeaveRequest(db.Model):
    __tablename__ = 'leave_requests'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    leave_type = db.Column(db.String(50), nullable=False) # Paid, Sick, Unpaid
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    remarks = db.Column(db.Text)
    status = db.Column(db.String(20), nullable=False, default='Pending') # Pending, Approved, Rejected
    admin_comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employee = db.relationship('Employee', back_populates='leave_requests')

    def to_dict(self):
        # Calculate days
        days = 0
        if self.start_date and self.end_date:
            days = (self.end_date - self.start_date).days + 1
            
        return {
            'id': self.id,
            'employee_id': self.employee.user.employee_id if self.employee and self.employee.user else None,
            'employee_name': self.employee.full_name if self.employee else None,
            'type': self.leave_type,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'days': days,
            'remarks': self.remarks,
            'status': self.status,
            'admin_comment': self.admin_comment,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
