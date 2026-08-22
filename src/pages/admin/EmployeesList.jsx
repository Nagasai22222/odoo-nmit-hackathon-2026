import React from 'react';
import { Plus, Eye, Edit } from 'lucide-react';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

const EmployeesList = () => {
  // Mock Data
  const employees = [
    { id: 1, employeeId: 'EMP-001', name: 'Admin User', email: 'admin@dayflow.com', department: 'HR', designation: 'HR Manager', joinDate: '2022-01-15', status: 'Active' },
    { id: 2, employeeId: 'EMP-002', name: 'John Doe', email: 'employee@dayflow.com', department: 'Engineering', designation: 'Software Engineer', joinDate: '2022-03-01', status: 'Active' },
    { id: 3, employeeId: 'EMP-003', name: 'Jane Smith', email: 'jane.smith@dayflow.com', department: 'Design', designation: 'UX Designer', joinDate: '2022-05-12', status: 'On Leave' },
    { id: 4, employeeId: 'EMP-004', name: 'Michael Johnson', email: 'michael.j@dayflow.com', department: 'Sales', designation: 'Sales Representative', joinDate: '2023-01-10', status: 'Active' },
    { id: 5, employeeId: 'EMP-005', name: 'Emily Davis', email: 'emily.d@dayflow.com', department: 'Engineering', designation: 'Frontend Developer', joinDate: '2023-04-20', status: 'Active' },
  ];

  const columns = [
    { header: 'Employee ID', key: 'employeeId', sortable: true },
    { 
      header: 'Name', 
      key: 'name', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{row.name}</span>
            <span className="text-xs text-slate-500">{row.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Department', key: 'department', sortable: true },
    { header: 'Designation', key: 'designation', sortable: true },
    { 
      header: 'Join Date', 
      key: 'joinDate', 
      sortable: true,
      render: (row) => new Date(row.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    { 
      header: 'Status', 
      key: 'status', 
      sortable: true,
      render: (row) => <StatusBadge status={row.status === 'Active' ? 'Present' : row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-1 text-primary-600 hover:bg-primary-50">
            <Eye size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 text-slate-600 hover:bg-slate-100">
            <Edit size={18} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your workforce, view details and edit profiles.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      <DataTable 
        columns={columns}
        data={employees}
        searchPlaceholder="Search employees by name, email or ID..."
        searchField={(item) => `${item.name} ${item.email} ${item.employeeId}`}
      />
    </div>
  );
};

export default EmployeesList;
