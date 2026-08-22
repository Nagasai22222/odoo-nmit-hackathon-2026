import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Bell, 
  LogOut,
  Briefcase
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { role, logout } = useAuth();

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: Users },
    { name: 'Attendance', path: '/employee/attendance', icon: CalendarClock },
    { name: 'Leave', path: '/employee/leave', icon: FileText },
    { name: 'Payroll', path: '/employee/payroll', icon: DollarSign },
    { name: 'Notifications', path: '/employee/notifications', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarClock },
    { name: 'Leave Requests', path: '/admin/leaves', icon: FileText },
    { name: 'Payroll', path: '/admin/payroll', icon: DollarSign },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-slate-200 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-white flex flex-col">
          <div className="flex items-center pl-2.5 mb-8 mt-2 gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="self-center text-xl font-bold whitespace-nowrap text-slate-800">Dayflow</span>
          </div>
          
          <ul className="space-y-2 font-medium flex-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center p-3 rounded-lg group transition-colors",
                      isActive 
                        ? "bg-primary-50 text-primary-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      // add class logic to icon if needed
                    )} />
                    <span className="ml-3">{link.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 mt-4 space-y-2 border-t border-slate-200">
            <button
              onClick={logout}
              className="flex items-center p-3 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
