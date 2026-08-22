import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

const AdminLeaves = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employeeId: 'EMP-001', name: 'John Doe', type: 'Paid Leave', startDate: '2023-11-15', endDate: '2023-11-17', days: 3, status: 'Pending', remarks: 'Family vacation' },
    { id: 2, employeeId: 'EMP-003', name: 'Jane Smith', type: 'Sick Leave', startDate: '2023-11-01', endDate: '2023-11-02', days: 2, status: 'Approved', remarks: 'Medical appointment' },
    { id: 3, employeeId: 'EMP-004', name: 'Michael Johnson', type: 'Unpaid Leave', startDate: '2023-10-25', endDate: '2023-10-26', days: 2, status: 'Rejected', remarks: 'Personal work' },
    { id: 4, employeeId: 'EMP-005', name: 'Emily Davis', type: 'Paid Leave', startDate: '2023-12-20', endDate: '2023-12-31', days: 12, status: 'Pending', remarks: 'Annual vacation' },
  ]);

  const openActionModal = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setComment('');
    setIsModalOpen(true);
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setLeaveRequests(prev => prev.map(req => 
        req.id === selectedLeave.id 
          ? { ...req, status: actionType === 'approve' ? 'Approved' : 'Rejected' }
          : req
      ));
      setIsSubmitting(false);
      setIsModalOpen(false);
      addToast(`Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`, 'success');
    }, 800);
  };

  const columns = [
    { header: 'Employee', key: 'name', sortable: true, render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-800">{row.name}</span>
        <span className="text-xs text-slate-500">{row.employeeId}</span>
      </div>
    )},
    { header: 'Leave Type', key: 'type', sortable: true },
    { 
      header: 'Duration', 
      key: 'duration',
      render: (row) => (
        <span className="text-sm">
          {new Date(row.startDate).toLocaleDateString()} to {new Date(row.endDate).toLocaleDateString()}
        </span>
      )
    },
    { header: 'Days', key: 'days', sortable: true },
    { header: 'Remarks', key: 'remarks' },
    { header: 'Status', key: 'status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        row.status === 'Pending' ? (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => openActionModal(row, 'approve')}>
              Approve
            </Button>
            <Button variant="secondary" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => openActionModal(row, 'reject')}>
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-sm text-slate-400">Action taken</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Leave Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage employee leave applications.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={leaveRequests}
            searchPlaceholder="Search by employee name..."
            searchField={(item) => item.name}
          />
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
      >
        {selectedLeave && (
          <form onSubmit={handleActionSubmit} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg text-sm mb-4">
              <p><strong>Employee:</strong> {selectedLeave.name} ({selectedLeave.employeeId})</p>
              <p><strong>Leave Type:</strong> {selectedLeave.type}</p>
              <p><strong>Duration:</strong> {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.days} days)</p>
              <p><strong>Reason:</strong> {selectedLeave.remarks}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Add a comment {actionType === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                placeholder={`Provide a reason for ${actionType === 'approve' ? 'approval (optional)' : 'rejection'}...`}
                required={actionType === 'reject'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant={actionType === 'approve' ? 'primary' : 'danger'} 
                type="submit" 
                isLoading={isSubmitting}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminLeaves;
