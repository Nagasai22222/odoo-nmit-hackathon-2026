import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Employees', path: `/${user?.role || 'employee'}/directory` },
    { name: 'Attendance', path: `/${user?.role || 'employee'}/attendance` },
    { name: 'Time Off', path: `/${user?.role || 'employee'}/leave` },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-8 h-full">
        <Link to={`/${user?.role || 'employee'}/directory`} className="text-xl font-bold text-slate-800 tracking-tight">
          Company Logo
        </Link>
        
        <div className="hidden md:flex h-full items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `px-4 h-full flex items-center text-sm font-medium transition-colors border-b-2 ${
                  isActive 
                  ? 'border-[#df80ff] text-[#df80ff]' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative border border-slate-300 rounded px-3 py-1.5 flex items-center bg-slate-50">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none text-sm outline-none w-48"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status Dot */}
          <div className={`w-3.5 h-3.5 rounded-full shadow-sm border border-white ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 relative hover:bg-slate-200 transition-colors"
            >
              <User size={18} className="text-slate-600" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                <Link 
                  to={`/${user?.role || 'employee'}/profile`} 
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className="bg-[#93c5fd] hover:bg-[#60a5fa] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors ml-2"
          onClick={() => {
            if (!isCheckedIn) {
              setIsCheckedIn(true);
              addToast("Upon successful Check IN", "success");
            } else {
              setIsCheckedIn(false);
              addToast("Successfully Checked OUT", "success");
            }
          }}
        >
          {isCheckedIn ? 'Check OUT' : 'Check IN'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
