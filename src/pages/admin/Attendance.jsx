import React from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const AdminAttendance = () => {
  const attendanceData = [
    { id: 1, name: 'John Doe', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
    { id: 2, name: 'Jane Smith', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
    { id: 3, name: 'Michael Johnson', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
    { id: 4, name: 'Emily Davis', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
    { id: 5, name: 'Robert Wilson', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  ];

  return (
    <div className="flex flex-col p-2 min-h-[80vh] max-w-7xl mx-auto">
      
      {/* Main List View */}
      <div className="flex-1 border border-slate-300 rounded-sm bg-white shadow-sm flex flex-col">
        
        {/* Header row */}
        <div className="flex items-center border-b border-slate-300 p-3">
          <h2 className="text-lg font-medium w-48 text-slate-800 px-2">Attendance</h2>
          <div className="flex-1 max-w-md">
            <div className="relative border border-slate-300 rounded-sm overflow-hidden flex items-center px-3 py-1.5 bg-slate-50">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Searchbar" 
                className="bg-transparent border-none text-sm outline-none w-full text-slate-700 italic"
              />
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-4 p-3 border-b border-slate-300 px-5">
          <div className="flex">
            <button className="border border-slate-300 p-1.5 hover:bg-slate-100 transition-colors text-slate-700">
              <ChevronLeft size={18} />
            </button>
            <button className="border-t border-b border-r border-slate-300 p-1.5 hover:bg-slate-100 transition-colors text-slate-700">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <button className="border border-slate-300 px-4 py-1.5 flex items-center gap-2 hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium">
            Date <ChevronDown size={16} />
          </button>
          
          <button className="border border-slate-300 px-6 py-1.5 hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium">
            Day
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border-b border-slate-300">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="p-4 border-r border-slate-300 w-[20%]"></th>
                <th colSpan="4" className="p-4 font-medium text-slate-800 tracking-wide text-sm">
                  22,October 2025
                </th>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Emp</th>
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Check In</th>
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Check Out</th>
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Work Hours</th>
                <th className="font-medium p-4 w-[20%] text-slate-800">Extra hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row) => (
                <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r border-slate-300 text-slate-600">{row.name}</td>
                  <td className="p-4 border-r border-slate-300 text-slate-600">{row.checkIn}</td>
                  <td className="p-4 border-r border-slate-300 text-slate-600">{row.checkOut}</td>
                  <td className="p-4 border-r border-slate-300 text-slate-600">{row.workHours}</td>
                  <td className="p-4 text-slate-600">{row.extraHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminAttendance;
