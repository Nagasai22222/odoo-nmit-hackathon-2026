import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { Download, Plus, Edit } from 'lucide-react';

const AdminPayroll = () => {
  const [payrollData, setPayrollData] = useState([
    { id: 1, employeeId: 'EMP-001', name: 'John Doe', department: 'Engineering', basic: 4000, allowances: 500, deductions: 250, net: 4250, month: 'October', year: '2023' },
    { id: 2, employeeId: 'EMP-002', name: 'Jane Smith', department: 'HR', basic: 3500, allowances: 400, deductions: 200, net: 3700, month: 'October', year: '2023' },
    { id: 3, employeeId: 'EMP-003', name: 'Michael Johnson', department: 'Sales', basic: 3000, allowances: 1000, deductions: 150, net: 3850, month: 'October', year: '2023' },
    { id: 4, employeeId: 'EMP-004', name: 'Emily Davis', department: 'Design', basic: 4200, allowances: 300, deductions: 280, net: 4220, month: 'October', year: '2023' },
  ]);

  const columns = [
    { header: 'Employee', key: 'name', sortable: true, render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-800">{row.name}</span>
        <span className="text-xs text-slate-500">{row.employeeId}</span>
      </div>
    )},
    { header: 'Department', key: 'department', sortable: true },
    { header: 'Basic', key: 'basic', sortable: true, render: (row) => `$${row.basic.toLocaleString()}` },
    { header: 'Allowances', key: 'allowances', render: (row) => <span className="text-green-600">+$${row.allowances.toLocaleString()}</span> },
    { header: 'Deductions', key: 'deductions', render: (row) => <span className="text-red-600">-$${row.deductions.toLocaleString()}</span> },
    { header: 'Net Salary', key: 'net', sortable: true, cellClassName: 'font-bold text-slate-800', render: (row) => `$${row.net.toLocaleString()}` },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-1 text-slate-600 hover:bg-slate-100">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 text-primary-600 hover:bg-primary-50">
            <Download size={18} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage employee salaries, allowances, and deductions.</p>
        </div>
        <div className="flex gap-2">
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-white">
            <option>October 2023</option>
            <option>September 2023</option>
            <option>August 2023</option>
          </select>
          <Button variant="primary" className="gap-2">
            <Plus size={18} /> Process Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-600 text-white border-none shadow-md">
          <CardContent className="p-6">
            <p className="text-primary-100 font-medium">Total Payroll Cost</p>
            <h3 className="text-3xl font-bold mt-2">$16,020.00</h3>
            <p className="text-sm mt-2 text-primary-200">For October 2023</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={payrollData}
            searchPlaceholder="Search by employee name..."
            searchField={(item) => item.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayroll;
