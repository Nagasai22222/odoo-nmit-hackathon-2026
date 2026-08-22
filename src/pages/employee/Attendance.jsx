import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../context/ToastContext';

const EmployeeAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { addToast } = useToast();

  const handleCheckInOut = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsCheckedIn(!isCheckedIn);
      setIsChecking(false);
      addToast(`Successfully checked ${isCheckedIn ? 'out' : 'in'}!`, 'success');
    }, 1000);
  };

  const attendanceHistory = [
    { id: 1, date: '2023-10-31', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: '8h 30m', status: 'Present' },
    { id: 2, date: '2023-10-30', checkIn: '08:55 AM', checkOut: '05:45 PM', workingHours: '8h 50m', status: 'Present' },
    { id: 3, date: '2023-10-27', checkIn: '09:15 AM', checkOut: '05:30 PM', workingHours: '8h 15m', status: 'Present' },
    { id: 4, date: '2023-10-26', checkIn: '09:00 AM', checkOut: '01:00 PM', workingHours: '4h 00m', status: 'Half-day' },
    { id: 5, date: '2023-10-25', checkIn: '-', checkOut: '-', workingHours: '-', status: 'Absent' },
  ];

  const columns = [
    { 
      header: 'Date', 
      key: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    },
    { header: 'Check In', key: 'checkIn' },
    { header: 'Check Out', key: 'checkOut' },
    { header: 'Working Hours', key: 'workingHours' },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Track your daily attendance and working hours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center mb-6 ${isCheckedIn ? 'border-green-100' : 'border-slate-100'}`}>
              <span className="text-3xl font-bold text-slate-800">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-sm text-slate-500">
                {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="w-full space-y-4">
              <Button 
                variant={isCheckedIn ? 'danger' : 'primary'} 
                className="w-full text-lg py-3"
                onClick={handleCheckInOut}
                isLoading={isChecking}
              >
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </Button>

              <div className="flex items-center justify-center text-sm text-slate-500 gap-2">
                <MapPin className="w-4 h-4" />
                <span>Office Location</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Attendance History</CardTitle>
            <div className="flex gap-2">
              <select className="text-sm border border-slate-300 rounded-md px-2 py-1">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable 
              columns={columns}
              data={attendanceHistory}
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
