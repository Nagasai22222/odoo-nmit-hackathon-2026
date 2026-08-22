import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { Calendar, Plus } from 'lucide-react';

const EmployeeLeave = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    leaveType: 'Paid',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  const leaveHistory = [
    { id: 1, type: 'Paid Leave', startDate: '2023-11-15', endDate: '2023-11-17', days: 3, status: 'Pending', remarks: 'Family vacation' },
    { id: 2, type: 'Sick Leave', startDate: '2023-10-10', endDate: '2023-10-11', days: 2, status: 'Approved', remarks: 'Fever and cold' },
    { id: 3, type: 'Unpaid Leave', startDate: '2023-08-05', endDate: '2023-08-05', days: 1, status: 'Rejected', remarks: 'Personal work' },
  ];

  const columns = [
    { header: 'Leave Type', key: 'type' },
    { 
      header: 'Duration', 
      key: 'duration',
      render: (row) => (
        <span className="text-sm">
          {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
        </span>
      )
    },
    { header: 'Days', key: 'days' },
    { header: 'Remarks', key: 'remarks' },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      addToast('Leave request submitted successfully!', 'success');
      setFormData({ leaveType: 'Paid', startDate: '', endDate: '', remarks: '' });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1">Apply for leave and view your leave history.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Apply Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-600 text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-100 font-medium">Available Paid Leave</p>
                <h3 className="text-3xl font-bold mt-2">12 <span className="text-xl font-normal opacity-80">Days</span></h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between text-sm">
              <span>Used: 8 days</span>
              <span>Total: 20 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium">Sick Leave</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800">5 <span className="text-xl font-normal text-slate-500">Days</span></h3>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm">
              <span className="text-slate-500">Used: 2 days</span>
              <span className="text-slate-500">Total: 7 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium">Unpaid Leave</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800">1 <span className="text-xl font-normal text-slate-500">Day</span></h3>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm">
              <span className="text-slate-500">Used this year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={leaveHistory}
            searchable={false}
          />
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Leave Type
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="Paid">Paid Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date" 
              required
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
            <Input 
              label="End Date" 
              type="date" 
              required
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Remarks / Reason
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              placeholder="Please provide a reason for your leave..."
              required
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeLeave;
