'use client'

import { Search, Check, X } from 'lucide-react'
import { useState } from 'react'

const initialRequests = [
  { id: 1, name: 'John Doe', startDate: '28/10/2025', endDate: '28/10/2025', type: 'Paid time Off', status: 'pending' },
  { id: 2, name: 'Jane Smith', startDate: '29/10/2025', endDate: '30/10/2025', type: 'Sick time off', status: 'pending' },
  { id: 3, name: 'Michael Johnson', startDate: '01/11/2025', endDate: '05/11/2025', type: 'Paid time Off', status: 'approved' },
]

export default function AdminLeavePage() {
  const [requests, setRequests] = useState(initialRequests)

  const handleStatusChange = (id: number, newStatus: string) => {
    setRequests(current => 
      current.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      
      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button className="px-8 py-3 text-sm font-semibold bg-rose-100/50 text-rose-700 border-r border-slate-200 hover:bg-rose-100 transition-colors">
          Time Off
        </button>
        <button className="px-8 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
          Allocation
        </button>
      </div>

      {/* Action Row: New Button & Search */}
      <div className="flex items-center px-6 py-4 border-b border-slate-200 gap-6">
        <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold text-sm px-6 py-1.5 rounded transition-colors shadow-sm uppercase tracking-wide">
          NEW
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Searchbar" 
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Summary Row */}
      <div className="flex items-center border-b border-slate-200 divide-x divide-slate-200">
        <div className="flex-1 px-8 py-4 text-center">
          <p className="text-blue-500 font-semibold mb-1">Paid time Off</p>
          <p className="text-slate-600 text-sm">24 Days Available</p>
        </div>
        <div className="flex-1 px-8 py-4 text-center">
          <p className="text-blue-500 font-semibold mb-1">Sick time off</p>
          <p className="text-slate-600 text-sm">07 Days Available</p>
        </div>
      </div>

      {/* Data Table with thin borders */}
      <div className="flex-1 p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-800 min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="border border-slate-800 p-3 text-sm font-semibold text-slate-700">Name</th>
              <th className="border border-slate-800 p-3 text-sm font-semibold text-slate-700">Start Date</th>
              <th className="border border-slate-800 p-3 text-sm font-semibold text-slate-700">End Date</th>
              <th className="border border-slate-800 p-3 text-sm font-semibold text-slate-700">Time off Type</th>
              <th className="border border-slate-800 p-3 text-sm font-semibold text-slate-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-800 p-3 text-sm font-medium text-slate-900">{req.name}</td>
                <td className="border border-slate-800 p-3 text-sm text-slate-600">{req.startDate}</td>
                <td className="border border-slate-800 p-3 text-sm text-slate-600">{req.endDate}</td>
                <td className="border border-slate-800 p-3 text-sm font-medium text-blue-500">{req.type}</td>
                <td className="border border-slate-800 p-3 text-sm">
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleStatusChange(req.id, 'rejected')}
                        className="w-6 h-6 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-sm" 
                        title="Reject"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(req.id, 'approved')}
                        className="w-6 h-6 rounded bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors shadow-sm" 
                        title="Approve"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase
                        ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {req.status}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {/* Filler rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={`filler-${i}`}>
                <td className="border border-slate-800 p-3 text-sm h-12"></td>
                <td className="border border-slate-800 p-3 text-sm"></td>
                <td className="border border-slate-800 p-3 text-sm"></td>
                <td className="border border-slate-800 p-3 text-sm"></td>
                <td className="border border-slate-800 p-3 text-sm"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}