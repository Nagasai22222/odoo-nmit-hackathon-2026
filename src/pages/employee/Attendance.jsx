import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const EmployeeAttendance = () => {
  const [activeSection, setActiveSection] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // October
  const dropdownRef = useRef(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0));
  };

  const attendanceData = [
    { id: 1, date: `28/${(currentMonthIndex + 1).toString().padStart(2, '0')}/2025`, checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
    { id: 2, date: `29/${(currentMonthIndex + 1).toString().padStart(2, '0')}/2025`, checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  ];

  return (
    <div className="p-2 min-h-[80vh] max-w-5xl mx-auto">
      <div className="border border-slate-300 rounded-sm bg-white shadow-sm flex flex-col">
        
        {/* Header row */}
        <div className="flex items-center border-b border-slate-300 p-3">
          <h2 className="text-lg font-medium text-slate-800 px-2">Attendance</h2>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-4 p-3 border-b border-slate-300 px-5 flex-wrap">
          <div className="flex">
            <button 
              onClick={handlePrevMonth}
              className="border border-slate-300 p-1.5 hover:bg-slate-100 transition-colors text-slate-700"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleNextMonth}
              className="border-t border-b border-r border-slate-300 p-1.5 hover:bg-slate-100 transition-colors text-slate-700"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="border border-slate-300 px-4 py-1.5 flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium w-20"
            >
              {months[currentMonthIndex]} <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-10 max-h-60 overflow-y-auto">
                {months.map((month, idx) => (
                  <button
                    key={month}
                    onClick={() => {
                      setCurrentMonthIndex(idx);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentMonthIndex === idx ? 'text-[#df80ff] font-medium bg-purple-50' : 'text-slate-700'}`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setActiveSection(activeSection === 'present' ? '' : 'present')}
            className={`border border-slate-300 px-4 py-1.5 transition-colors text-sm font-medium ${
              activeSection === 'present' ? 'bg-[#df80ff] text-white border-[#df80ff]' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Count of days present
          </button>
          
          <button 
            onClick={() => setActiveSection(activeSection === 'leaves' ? '' : 'leaves')}
            className={`border border-slate-300 px-4 py-1.5 transition-colors text-sm font-medium ${
              activeSection === 'leaves' ? 'bg-[#df80ff] text-white border-[#df80ff]' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Leaves count
          </button>
          
          <button 
            onClick={() => setActiveSection(activeSection === 'total' ? '' : 'total')}
            className={`border border-slate-300 px-4 py-1.5 transition-colors text-sm font-medium ${
              activeSection === 'total' ? 'bg-[#df80ff] text-white border-[#df80ff]' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Total working days
          </button>
        </div>

        {/* Dynamic Section Display */}
        {activeSection && (
          <div className="bg-purple-50 border-b border-slate-300 p-4 text-center text-sm font-medium text-purple-800 animate-in fade-in slide-in-from-top-2 duration-300">
            {activeSection === 'present' && `You have been present for 20 days in ${fullMonths[currentMonthIndex]} 2025.`}
            {activeSection === 'leaves' && `You have taken 2 leaves in ${fullMonths[currentMonthIndex]} 2025.`}
            {activeSection === 'total' && `There are a total of 22 working days in ${fullMonths[currentMonthIndex]} 2025.`}
          </div>
        )}

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border-b border-slate-300">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50">
                <th className="p-4 border-r border-slate-300 w-[20%]"></th>
                <th colSpan="4" className="p-4 font-medium text-slate-800 tracking-wide text-sm bg-white">
                  22,{fullMonths[currentMonthIndex]} 2025
                </th>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Date</th>
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Check In</th>
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Check Out</th>
                <th className="font-medium p-4 border-r border-slate-300 w-[20%] text-slate-800">Work Hours</th>
                <th className="font-medium p-4 w-[20%] text-slate-800">Extra hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row) => (
                <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r border-slate-300 text-slate-600 font-medium">{row.date}</td>
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

export default EmployeeAttendance;
