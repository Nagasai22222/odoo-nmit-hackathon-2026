import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { Download } from 'lucide-react';

const AdminAttendance = () => {
  const attendanceData = [
    { id: 1, employeeId: 'EMP-001', name: 'John Doe', date: '2023-10-31', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: '8h 30m', status: 'Present' },
    { id: 2, employeeId: 'EMP-002', name: 'Jane Smith', date: '2023-10-31', checkIn: '09:15 AM', checkOut: '05:45 PM', workingHours: '8h 30m', status: 'Present' },
    { id: 3, employeeId: 'EMP-003', name: 'Michael Johnson', date: '2023-10-31', checkIn: '09:00 AM', checkOut: '01:00 PM', workingHours: '4h 00m', status: 'Half-day' },
    { id: 4, employeeId: 'EMP-004', name: 'Emily Davis', date: '2023-10-31', checkIn: '-', checkOut: '-', workingHours: '-', status: 'Leave' },
    { id: 5, employeeId: 'EMP-005', name: 'Robert Wilson', date: '2023-10-31', checkIn: '-', checkOut: '-', workingHours: '-', status: 'Absent' },
  ];

  const columns = [
    { header: 'Employee', key: 'name', sortable: true, render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-800">{row.name}</span>
        <span className="text-xs text-slate-500">{row.employeeId}</span>
      </div>
    )},
    { header: 'Date', key: 'date', sortable: true, render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Check In', key: 'checkIn' },
    { header: 'Check Out', key: 'checkOut' },
    { header: 'Working Hours', key: 'workingHours' },
    { header: 'Status', key: 'status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Log</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor employee attendance records across the organization.</p>
        </div>
        <div className="flex gap-2">
          <input type="date" className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" defaultValue="2023-10-31" />
          <Button variant="secondary" className="gap-2">
            <Download size={18} /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Present</p>
              <p className="text-2xl font-bold text-slate-800">142</p>
            </div>
            <div className="w-2 h-10 rounded-full bg-green-500"></div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Absent</p>
              <p className="text-2xl font-bold text-slate-800">3</p>
            </div>
            <div className="w-2 h-10 rounded-full bg-red-500"></div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Half Day</p>
              <p className="text-2xl font-bold text-slate-800">2</p>
            </div>
            <div className="w-2 h-10 rounded-full bg-yellow-500"></div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">On Leave</p>
              <p className="text-2xl font-bold text-slate-800">3</p>
            </div>
            <div className="w-2 h-10 rounded-full bg-purple-500"></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={attendanceData}
            searchPlaceholder="Search by employee name or ID..."
            searchField={(item) => `${item.name} ${item.employeeId}`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAttendance;
