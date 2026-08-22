import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { 
  CalendarClock, 
  FileText, 
  ClipboardList, 
  DollarSign, 
  User, 
  Clock, 
  LogOut,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  // Mock data
  const recentActivity = [
    { id: 1, type: 'attendance', action: 'Checked In', time: '09:00 AM, Today', status: 'Present' },
    { id: 2, type: 'leave', action: 'Applied for Sick Leave', time: 'Yesterday', status: 'Pending' },
    { id: 3, type: 'attendance', action: 'Checked Out', time: '05:30 PM, Yesterday', status: 'Present' },
    { id: 4, type: 'payroll', action: 'Salary Credited', time: 'Oct 31, 2023', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Good Morning, {user?.name?.split(' ')[0] || 'Employee'}
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Clock size={16} /> Check In
          </Button>
          <Button variant="primary" className="gap-2">
            <LogOut size={16} /> Check Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Attendance" 
          value="95%" 
          subtitle="This month"
          icon={CalendarClock}
          colorClass="bg-blue-50 text-blue-600"
          trend="up"
          trendValue="2%"
        />
        <DashboardCard 
          title="Leave Balance" 
          value="12 Days" 
          subtitle="Available annual leave"
          icon={FileText}
          colorClass="bg-green-50 text-green-600"
        />
        <DashboardCard 
          title="Pending Requests" 
          value="1" 
          subtitle="Leave request waiting"
          icon={ClipboardList}
          colorClass="bg-yellow-50 text-yellow-600"
        />
        <DashboardCard 
          title="Current Salary" 
          value="$4,250" 
          subtitle="Net pay last month"
          icon={DollarSign}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      {activity.type === 'attendance' && <Clock size={18} />}
                      {activity.type === 'leave' && <FileText size={18} />}
                      {activity.type === 'payroll' && <DollarSign size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                  <StatusBadge status={activity.status} />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 text-center">
              <Button variant="ghost" size="sm" className="text-primary-600">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/employee/profile" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400 group-hover:text-primary-600" />
                <span className="font-medium text-slate-700 group-hover:text-primary-700">View Profile</span>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600" />
            </Link>
            
            <Link to="/employee/leave" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400 group-hover:text-primary-600" />
                <span className="font-medium text-slate-700 group-hover:text-primary-700">Apply Leave</span>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600" />
            </Link>
            
            <Link to="/employee/payroll" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-slate-400 group-hover:text-primary-600" />
                <span className="font-medium text-slate-700 group-hover:text-primary-700">View Payroll</span>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
