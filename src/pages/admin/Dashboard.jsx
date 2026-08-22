import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/ui/DashboardCard';
import ChartCard from '../../components/ui/ChartCard';
import { Users, UserCheck, UserX, UserMinus, ClipboardList } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data for charts
  const attendanceData = [
    { name: 'Mon', present: 145, absent: 5 },
    { name: 'Tue', present: 142, absent: 8 },
    { name: 'Wed', present: 148, absent: 2 },
    { name: 'Thu', present: 140, absent: 10 },
    { name: 'Fri', present: 135, absent: 15 },
  ];

  const leaveDistributionData = [
    { name: 'Paid', value: 15 },
    { name: 'Sick', value: 8 },
    { name: 'Unpaid', value: 2 },
  ];

  const departmentData = [
    { name: 'Engineering', count: 45 },
    { name: 'Design', count: 12 },
    { name: 'Marketing', count: 18 },
    { name: 'Sales', count: 25 },
    { name: 'HR', count: 5 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Admin Overview
        </h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard 
          title="Total Employees" 
          value="150" 
          icon={Users}
          colorClass="bg-blue-50 text-blue-600"
        />
        <DashboardCard 
          title="Present Today" 
          value="135" 
          icon={UserCheck}
          colorClass="bg-green-50 text-green-600"
        />
        <DashboardCard 
          title="Absent Today" 
          value="5" 
          icon={UserX}
          colorClass="bg-red-50 text-red-600"
        />
        <DashboardCard 
          title="On Leave" 
          value="10" 
          icon={UserMinus}
          colorClass="bg-yellow-50 text-yellow-600"
        />
        <DashboardCard 
          title="Pending Leaves" 
          value="8" 
          icon={ClipboardList}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Weekly Attendance Overview">
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <RechartsTooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" />
            <Bar dataKey="present" name="Present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Employees by Department">
          <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
            <RechartsTooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Bar dataKey="count" name="Employees" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
              {
                departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))
              }
            </Bar>
          </BarChart>
        </ChartCard>

        <ChartCard title="Leave Distribution (This Month)">
          <PieChart>
            <Pie
              data={leaveDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {leaveDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
