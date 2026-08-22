from database import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    document_name = db.Column(db.String(255), nullable=False)
    document_path = db.Column(db.String(255), nullable=False)
    document_type = db.Column(db.String(50))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    employee = db.relationship('Employee', back_populates='documents')

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee.user.employee_id if self.employee and self.employee.user else None,
            'document_name': self.document_name,
            'document_path': self.document_path,
            'document_type': self.document_type,
            'uploaded_at': self.uploaded_at.isoformat()
        }
