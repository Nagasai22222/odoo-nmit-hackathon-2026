import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center justify-start">
        <button
          onClick={toggleSidebar}
          className="inline-flex items-center p-2 text-sm text-slate-500 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to={user?.role === 'admin' ? '/admin/notifications' : '/employee/notifications'}
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
            <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shadow-sm border border-primary-200">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
