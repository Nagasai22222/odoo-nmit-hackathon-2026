import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EmployeeLeave = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Helper to generate a dummy month grid (31 days)
  const renderMonth = (monthName, index) => {
    // Just a dummy layout to look like a calendar month
    const startDayOffset = index % 7; 
    const days = [];
    
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="text-center text-xs p-1"></div>);
    }
    
    for (let i = 1; i <= 31; i++) {
      // Highlight some random days based on the month to match the mockup's feel
      let bgClass = "text-slate-600";
      
      if (monthName === 'January' && i === 7) bgClass = "bg-green-100 text-green-700 rounded-full font-medium";
      if (monthName === 'April' && i === 20) bgClass = "bg-red-100 text-red-700 rounded-full font-medium";
      if (monthName === 'July' && i === 1) bgClass = "bg-red-500 text-white rounded-full font-medium"; // Mockup points to a red dot in July
      if (monthName === 'October' && i === 22) bgClass = "bg-slate-200 text-slate-800 rounded-full font-medium";
      
      days.push(
        <div key={i} className={`text-center text-[10px] p-1 ${bgClass} cursor-default`}>
          {i}
        </div>
      );
    }

    return (
      <div key={monthName} className="mb-6">
        <h4 className="text-xs font-bold text-slate-800 mb-2">{monthName} 2026</h4>
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-slate-400">{d}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 min-h-[80vh] max-w-6xl mx-auto">
      <div className="border border-slate-300 rounded-sm bg-white shadow-sm flex flex-col">
        
        {/* Top Tab */}
        <div className="flex border-b border-slate-300">
          <button className="px-8 py-3 font-medium text-sm bg-slate-100 text-slate-800 border-r border-slate-300">
            Time Off
          </button>
          <div className="flex-1"></div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 p-3 border-b border-slate-300">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1.5 text-sm font-medium rounded-sm uppercase tracking-wide transition-colors"
          >
            NEW
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex border-b border-slate-300">
          <div className="flex-1 p-4 border-r border-slate-300 flex flex-col items-center justify-center">
            <h3 className="text-blue-500 font-medium mb-1 text-lg">Paid time Off</h3>
            <p className="text-sm text-slate-700 font-medium">24 Days Available</p>
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-center border-r border-slate-300">
            <h3 className="text-blue-500 font-medium mb-1 text-lg">Sick time off</h3>
            <p className="text-sm text-slate-700 font-medium">07 Days Available</p>
          </div>
          {/* Space for the legend width */}
          <div className="w-64"></div>
        </div>

        {/* Calendar and Legend Area */}
        <div className="flex flex-col md:flex-row flex-1">
          
          {/* 12-Month Calendar Grid */}
          <div className="flex-1 p-6 border-r border-slate-300 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
              {months.map((m, i) => renderMonth(m, i))}
            </div>
          </div>

          {/* Legend Sidebar */}
          <div className="w-full md:w-64 p-6 bg-white">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Legend</h3>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-600">Validated</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-400 opacity-50"></div>
                <span className="text-xs text-slate-600">To Approve</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-600">Refused</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-4">Public Holidays</h3>
            
            <div className="space-y-3">
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Jan 14, 2026 :</span> Kite Festival
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Jan 26, 2026 :</span> Republic Day
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Mar 4, 2026 :</span> Dhuleti
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Aug 15, 2026 :</span> Independence Day
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Aug 28, 2026 :</span> Rakhi
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Oct 2, 2026 :</span> Gandhi Jayanti
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Nov 8, 2026 :</span> Diwali
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Nov 10, 2026 :</span> New Year
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Nov 11, 2026 :</span> Bhai Duj
              </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* New Time Off Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">New Time Off Request</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time off Type</label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-slate-700">
                  <option>Paid time Off</option>
                  <option>Sick time off</option>
                  <option>Unpaid leave</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-slate-700" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
                <textarea 
                  rows="3" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-slate-700 resize-none"
                  placeholder="Enter reason for time off..."
                ></textarea>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  addToast("Time off request submitted successfully!", "success");
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
              >
                Submit Request
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeLeave;
