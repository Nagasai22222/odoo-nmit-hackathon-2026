import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';

const AdminLeaves = () => {
  const [activeTab, setActiveTab] = useState('timeoff');

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'John Doe', startDate: '28/10/2025', endDate: '28/10/2025', type: 'Paid time Off', status: '' },
    { id: 2, name: 'Jane Smith', startDate: '28/10/2025', endDate: '28/10/2025', type: 'Paid time Off', status: '' },
    { id: 3, name: 'Michael Johnson', startDate: '28/10/2025', endDate: '28/10/2025', type: 'Sick time off', status: '' },
    { id: 4, name: 'Emily Davis', startDate: '28/10/2025', endDate: '28/10/2025', type: 'Paid time Off', status: '' },
    { id: 5, name: 'Robert Wilson', startDate: '28/10/2025', endDate: '28/10/2025', type: 'Sick time off', status: '' },
  ]);

  const handleStatusUpdate = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  return (
    <div className="p-2 min-h-[80vh] max-w-6xl mx-auto">
      <div className="border border-slate-300 rounded-sm bg-white shadow-sm flex flex-col">
        
        {/* Top Tabs */}
        <div className="flex border-b border-slate-300">
          <button 
            onClick={() => setActiveTab('timeoff')}
            className={`px-8 py-3 font-medium text-sm transition-colors ${
              activeTab === 'timeoff' 
                ? 'bg-slate-100 text-slate-800 border-r border-slate-300' 
                : 'text-slate-600 hover:bg-slate-50 border-r border-slate-300'
            }`}
          >
            Time Off
          </button>
          <button 
            onClick={() => setActiveTab('allocation')}
            className={`px-8 py-3 font-medium text-sm transition-colors ${
              activeTab === 'allocation' 
                ? 'bg-slate-100 text-slate-800 border-r border-slate-300' 
                : 'text-slate-600 hover:bg-slate-50 border-r border-slate-300'
            }`}
          >
            Allocation
          </button>
          <div className="flex-1"></div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 p-3 border-b border-slate-300">
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1.5 text-sm font-medium rounded-sm uppercase tracking-wide">
            NEW
          </button>
          <div className="relative border border-slate-300 rounded-sm overflow-hidden flex items-center px-3 py-1.5 bg-slate-50 flex-1 max-w-md ml-12">
            <Search size={16} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Searchbar" 
              className="bg-transparent border-none text-sm outline-none w-full text-slate-700 italic"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex border-b border-slate-300">
          <div className="flex-1 p-4 border-r border-slate-300 flex flex-col items-center justify-center">
            <h3 className="text-blue-500 font-medium mb-1">Paid time Off</h3>
            <p className="text-sm text-slate-700 font-medium">24 Days Available</p>
          </div>
          <div className="flex-1 p-4 border-r border-slate-300 flex flex-col items-center justify-center">
            <h3 className="text-blue-500 font-medium mb-1">Sick time off</h3>
            <p className="text-sm text-slate-700 font-medium">07 Days Available</p>
          </div>
          <div className="w-[30%]"></div> {/* Empty space to match grid */}
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-y-scroll max-h-[500px]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-300 bg-slate-50">
                <th className="font-medium p-3 border-r border-slate-300 text-slate-800">Name</th>
                <th className="font-medium p-3 border-r border-slate-300 text-slate-800">Start Date</th>
                <th className="font-medium p-3 border-r border-slate-300 text-slate-800">End Date</th>
                <th className="font-medium p-3 border-r border-slate-300 text-slate-800">Time off Type</th>
                <th className="font-medium p-3 border-r border-slate-300 text-slate-800">Status</th>
                <th className="font-medium p-3 text-slate-800 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((row) => (
                <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50 transition-colors h-12">
                  <td className="p-3 border-r border-slate-300 text-slate-700">{row.name}</td>
                  <td className="p-3 border-r border-slate-300 text-slate-700">{row.startDate}</td>
                  <td className="p-3 border-r border-slate-300 text-slate-700">{row.endDate}</td>
                  <td className="p-3 border-r border-slate-300 text-blue-500 font-medium">{row.type}</td>
                  <td className="p-3 border-r border-slate-300">
                    {row.status === 'Approved' && <span className="text-green-600 font-medium">Approved</span>}
                    {row.status === 'Rejected' && <span className="text-red-500 font-medium">Rejected</span>}
                    {row.status === '' && <span className="text-slate-500 italic">Pending</span>}
                  </td>
                  <td className="p-3 flex items-center gap-2 justify-center h-full">
                    {row.status === '' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(row.id, 'Rejected')}
                          className="w-6 h-4 bg-red-400 hover:bg-red-500 rounded-sm flex items-center justify-center group transition-colors" 
                          title="Reject"
                        >
                          <X size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(row.id, 'Approved')}
                          className="w-6 h-4 bg-green-500 hover:bg-green-600 rounded-sm flex items-center justify-center group transition-colors" 
                          title="Approve"
                        >
                          <Check size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="h-64">
                <td className="border-r border-slate-300"></td>
                <td className="border-r border-slate-300"></td>
                <td className="border-r border-slate-300"></td>
                <td className="border-r border-slate-300"></td>
                <td className="border-r border-slate-300"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminLeaves;
