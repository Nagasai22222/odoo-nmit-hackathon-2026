import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import ChartCard from '../../components/ui/ChartCard';
import Button from '../../components/ui/Button';
import { Download, Filter } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const AdminReports = () => {
  // Mock Data for Reports
  const attendanceMonthly = [
    { name: 'Week 1', present: 95, absent: 5 },
    { name: 'Week 2', present: 92, absent: 8 },
    { name: 'Week 3', present: 98, absent: 2 },
    { name: 'Week 4', present: 90, absent: 10 },
  ];

  const leaveReport = [
    { name: 'Paid', value: 45 },
    { name: 'Sick', value: 25 },
    { name: 'Unpaid', value: 10 },
    { name: 'Pending', value: 5 },
    { name: 'Rejected', value: 15 },
  ];

  const payrollDepartment = [
    { name: 'Engineering', cost: 45000 },
    { name: 'Sales', cost: 25000 },
    { name: 'Marketing', cost: 18000 },
    { name: 'Design', cost: 12000 },
    { name: 'HR', cost: 8000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Comprehensive view of HR metrics and data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Filter size={18} /> Filters
          </Button>
          <Button variant="primary" className="gap-2">
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Attendance Trends">
          <BarChart data={attendanceMonthly}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Legend iconType="circle" />
            <Bar dataKey="present" name="Present (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Absent (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Leave Requests Breakdown">
          <PieChart>
            <Pie
              data={leaveReport}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {leaveReport.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Payroll Cost by Department (Monthly)">
          <BarChart data={payrollDepartment} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="cost" name="Cost" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
              {payrollDepartment.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg text-blue-800">
              <h4 className="font-semibold mb-1">High Attendance Rate</h4>
              <p className="text-sm">Overall attendance has increased by 4% compared to last month.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
              <h4 className="font-semibold mb-1">Leave Utilization</h4>
              <p className="text-sm">Engineering department has the highest leave utilization this quarter.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-purple-800">
              <h4 className="font-semibold mb-1">Payroll Efficiency</h4>
              <p className="text-sm">Average salary across all departments is $3,850.00.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
