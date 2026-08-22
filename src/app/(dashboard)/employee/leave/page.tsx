'use client'

import { Search, X, Upload } from 'lucide-react'
import { useState } from 'react'

// Dummy leaves to highlight on calendar
const dummyLeaves = [
  { date: '2026-05-13', type: 'sick', status: 'approved' },
  { date: '2026-05-14', type: 'sick', status: 'approved' },
  { date: '2026-07-09', type: 'paid', status: 'pending' },
]

function MonthCalendar({ month, year }: { month: number, year: number }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDay + 1
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
      const leave = dummyLeaves.find(l => l.date === dateStr)
      return { dayNumber, leave }
    }
    return { dayNumber: null, leave: null }
  })

  return (
    <div className="w-full">
      <h3 className="text-xs font-bold text-slate-800 mb-2">{monthNames[month]} {year}</h3>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-[10px] font-semibold text-slate-500">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <div key={i} className="text-[10px] h-6 flex items-center justify-center">
            {d.dayNumber && (
              <span className={`w-5 h-5 flex items-center justify-center rounded-full ${
                d.leave?.type === 'sick' ? 'bg-emerald-100 text-emerald-800 font-bold' :
                d.leave?.type === 'paid' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'text-slate-700'
              }`}>
                {d.dayNumber}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EmployeeLeavePage() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px] relative">
      
      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button className="px-8 py-3 text-sm font-semibold bg-rose-100/50 text-rose-700 border-r border-slate-200 hover:bg-rose-100 transition-colors">
          Time Off
        </button>
        <button className="px-8 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
          Allocation
        </button>
      </div>

      {/* Action Row: New Button */}
      <div className="flex items-center px-6 py-4 border-b border-slate-200 gap-6">
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold text-sm px-6 py-1.5 rounded transition-colors shadow-sm uppercase tracking-wide"
        >
          NEW
        </button>
      </div>

      {/* Summary Row */}
      <div className="flex items-center border-b border-slate-200 divide-x divide-slate-200">
        <div className="flex-1 px-8 py-4 text-center">
          <p className="text-blue-500 font-semibold mb-1 text-lg">Paid time Off</p>
          <p className="text-slate-600 text-sm">24 Days Available</p>
        </div>
        <div className="flex-1 px-8 py-4 text-center">
          <p className="text-blue-500 font-semibold mb-1 text-lg">Sick time off</p>
          <p className="text-slate-600 text-sm">07 Days Available</p>
        </div>
      </div>

      {/* Calendar Grid Area */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-y-auto">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">
          {Array.from({ length: 12 }, (_, i) => (
            <MonthCalendar key={i} month={i} year={2026} />
          ))}
        </div>

        {/* Legend sidebar */}
        <div className="w-full lg:w-48 xl:w-64 border-l border-slate-200 pl-6 flex flex-col gap-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Legend</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-100"></div> Validated
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div> To Approve
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-slate-300"></div> Refused
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Public Holidays</h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li>Jan 14, 2026: Holi Festival</li>
              <li>Jan 26, 2026: Republic Day</li>
              <li>Mar 4, 2026: Dhuleti</li>
              <li>Aug 15, 2026: Independence Day</li>
              <li>Aug 28, 2026: Rakhi</li>
              <li>Oct 2, 2026: Gandhi Jayanti</li>
              <li>Nov 9, 2026: Diwali</li>
              <li>Nov 10, 2026: New Year</li>
              <li>Nov 11, 2026: Bhai Duj</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Time off Request Modal */}
      {isNewModalOpen && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Time off Type Request</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Employee</label>
                <div className="col-span-2 text-sm text-blue-500 font-medium">[Employee Name]</div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Time off Type</label>
                <select className="col-span-2 text-sm text-blue-500 bg-transparent border-none p-0 focus:ring-0 font-medium cursor-pointer">
                  <option>Paid time off</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leaves</option>
                </select>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Validity Period</label>
                <div className="col-span-2 flex items-center gap-3 text-sm text-blue-500 font-medium">
                  <input type="date" className="bg-transparent border-none p-0 w-28 focus:ring-0 cursor-pointer" defaultValue="2026-05-13" />
                  <span className="text-slate-400">To</span>
                  <input type="date" className="bg-transparent border-none p-0 w-28 focus:ring-0 cursor-pointer" defaultValue="2026-05-14" />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Allocation</label>
                <div className="col-span-2 flex items-center gap-2 text-sm">
                  <span className="text-blue-500 font-medium">01.00</span>
                  <span className="text-slate-600">Days</span>
                </div>
              </div>

              <div className="grid grid-cols-3 items-start gap-4">
                <label className="text-sm font-medium text-slate-700 pt-2">Attachment:</label>
                <div className="col-span-2">
                  <button className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors">
                    <Upload className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-slate-500 mt-2">(For sick leave certificate)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="bg-fuchsia-400 hover:bg-fuchsia-500 text-white text-xs font-semibold px-6 py-2 rounded shadow-sm transition-colors uppercase tracking-wider"
              >
                Submit
              </button>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-semibold px-6 py-2 rounded shadow-sm transition-colors uppercase tracking-wider"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}