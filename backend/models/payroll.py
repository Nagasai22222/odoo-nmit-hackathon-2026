from database import db
from datetime import datetime

class Payroll(db.Model):
    __tablename__ = 'payroll'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    basic_salary = db.Column(db.Float, nullable=False)
    allowances = db.Column(db.Float, default=0.0)
    deductions = db.Column(db.Float, default=0.0)
    net_salary = db.Column(db.Float, nullable=False)
    month = db.Column(db.String(20), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employee = db.relationship('Employee', back_populates='payrolls')

    def calculate_net_salary(self):
        self.net_salary = self.basic_salary + self.allowances - self.deductions

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee.user.employee_id if self.employee and self.employee.user else None,
            'employee_name': self.employee.full_name if self.employee else None,
            'department': self.employee.department if self.employee else None,
            'designation': self.employee.designation if self.employee else None,
            'basic_salary': self.basic_salary,
            'allowances': self.allowances,
            'deductions': self.deductions,
            'net_salary': self.net_salary,
            'month': self.month,
            'year': self.year,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
