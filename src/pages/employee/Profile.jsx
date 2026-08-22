import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, FileText } from 'lucide-react';

const EmployeeProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal and job information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name || 'Employee Name'}</h2>
              <p className="text-sm text-slate-500 mb-4">{user?.role === 'admin' ? 'HR Manager' : 'Software Engineer'}</p>
              
              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
                  <span>{user?.employeeId || 'EMP-000'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span>{user?.email || 'email@example.com'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-3 text-slate-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                  <span>123 Main St, New York, NY 10001</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-slate-700">Offer Letter.pdf</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600">View</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-slate-700">ID Proof.pdf</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600">View</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Personal Information</CardTitle>
              <Button variant="secondary" size="sm">Edit</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={user?.name || ''} disabled />
                <Input label="Employee ID" defaultValue={user?.employeeId || ''} disabled />
                <Input label="Email Address" defaultValue={user?.email || ''} disabled />
                <Input label="Phone Number" defaultValue="+1 (555) 123-4567" disabled />
                <Input label="Date of Birth" type="date" defaultValue="1990-01-01" disabled />
                <Input label="Gender" defaultValue="Male" disabled />
                <div className="md:col-span-2">
                  <Input label="Address" defaultValue="123 Main St, New York, NY 10001" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Department</p>
                  <p className="font-medium text-slate-800">Engineering</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Designation</p>
                  <p className="font-medium text-slate-800">Software Engineer</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Joining Date</p>
                  <p className="font-medium text-slate-800">March 1, 2022</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Employment Type</p>
                  <p className="font-medium text-slate-800">Full-Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-medium text-slate-800">$4,000.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Allowances</span>
                  <span className="font-medium text-slate-800">$500.00</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-3">
                  <span className="text-slate-600">Deductions (Tax, Insurance)</span>
                  <span className="font-medium text-red-600">-$250.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-slate-200 pt-3 text-slate-800">
                  <span>Net Salary</span>
                  <span className="text-primary-600">$4,250.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
