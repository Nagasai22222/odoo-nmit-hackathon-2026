import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Directory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock employee data
  const employees = [
    { id: 1, name: 'Admin User', designation: 'HR Manager', email: 'admin@dayflow.com' },
    { id: 2, name: 'John Doe', designation: 'Software Engineer', email: 'employee@dayflow.com' },
    { id: 3, name: 'Jane Smith', designation: 'UI/UX Designer', email: 'jane@dayflow.com' },
    { id: 4, name: 'Michael Brown', designation: 'Product Manager', email: 'michael@dayflow.com' },
    { id: 5, name: 'Emily Davis', designation: 'QA Tester', email: 'emily@dayflow.com' },
    { id: 6, name: 'William Wilson', designation: 'DevOps Engineer', email: 'william@dayflow.com' },
    { id: 7, name: 'Sarah Taylor', designation: 'Marketing Specialist', email: 'sarah@dayflow.com' },
    { id: 8, name: 'David Anderson', designation: 'Sales Executive', email: 'david@dayflow.com' },
    { id: 9, name: 'Jessica Thomas', designation: 'Accountant', email: 'jessica@dayflow.com' },
    { id: 10, name: 'Christopher Jackson', designation: 'IT Support', email: 'chris@dayflow.com' },
  ];

  const handleCardClick = (employeeId) => {
    // Navigate to the profile page with the employee ID
    navigate(`/${user?.role || 'employee'}/profile/${employeeId}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Employee Directory</h1>
        <div className="text-sm text-slate-500">
          Showing {employees.length} employees
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {employees.map((emp) => (
          <div 
            key={emp.id}
            onClick={() => handleCardClick(emp.id)}
            className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center cursor-pointer hover:border-[#df80ff] hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-[#f9effc] transition-colors border border-slate-200">
              <span className="text-xl font-bold text-slate-600 group-hover:text-[#df80ff]">
                {emp.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 text-center mb-1 line-clamp-1">{emp.name}</h3>
            <p className="text-xs text-slate-500 text-center line-clamp-1">{emp.designation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directory;
