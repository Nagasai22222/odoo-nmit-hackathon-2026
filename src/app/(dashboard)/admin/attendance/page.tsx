import { Search, ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react'

// Dummy data for visual representation of the wireframe
const dummyAttendance = [
  { id: 1, emp: 'John Doe', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: 2, emp: 'Jane Smith', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: 3, emp: 'Michael Johnson', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extraHours: '00:00' },
  { id: 4, emp: 'Emily Davis', checkIn: '10:15', checkOut: '19:45', workHours: '09:30', extraHours: '01:30' },
  { id: 5, emp: 'William Brown', checkIn: '09:00', checkOut: '17:00', workHours: '08:00', extraHours: '00:00' },
]

export default function AdminAttendancePage() {
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }) // e.g., "22 October 2025"

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      
      {/* Header Row: Title & Search */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900">Attendance</h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Searchbar" 
            className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Toolbar Row: Navigation & Date Selectors */}
      <div className="flex items-center px-6 py-3 border-b border-slate-200 gap-3">
        <button className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Calendar className="w-4 h-4" />
          Date
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="px-4 py-1.5 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors bg-slate-100/50">
          Day
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            {/* Super Header for Date */}
            <tr>
              <th className="border-b border-r border-slate-800 p-0"></th>
              <th colSpan={4} className="border-b border-slate-800 p-4 font-semibold text-slate-900 text-sm">
                {currentDate}
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-slate-50/50">
              <th className="border-b border-r border-slate-800 p-4 text-sm font-semibold text-slate-700 w-1/4">Emp</th>
              <th className="border-b border-r border-slate-800 p-4 text-sm font-semibold text-slate-700 w-1/6">Check In</th>
              <th className="border-b border-r border-slate-800 p-4 text-sm font-semibold text-slate-700 w-1/6">Check Out</th>
              <th className="border-b border-r border-slate-800 p-4 text-sm font-semibold text-slate-700 w-1/6">Work Hours</th>
              <th className="border-b border-slate-800 p-4 text-sm font-semibold text-slate-700 w-1/6">Extra hours</th>
            </tr>
          </thead>
          <tbody>
            {dummyAttendance.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="border-b border-r border-slate-800 p-4 text-sm font-medium text-slate-900">{record.emp}</td>
                <td className="border-b border-r border-slate-800 p-4 text-sm text-slate-600">{record.checkIn}</td>
                <td className="border-b border-r border-slate-800 p-4 text-sm text-slate-600">{record.checkOut}</td>
                <td className="border-b border-r border-slate-800 p-4 text-sm text-slate-600">{record.workHours}</td>
                <td className="border-b border-slate-800 p-4 text-sm text-slate-600">{record.extraHours}</td>
              </tr>
            ))}
            
            {/* Filler rows to match wireframe height */}
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={`filler-${i}`}>
                <td className="border-b border-r border-slate-800 p-4 text-sm h-14"></td>
                <td className="border-b border-r border-slate-800 p-4 text-sm"></td>
                <td className="border-b border-r border-slate-800 p-4 text-sm"></td>
                <td className="border-b border-r border-slate-800 p-4 text-sm"></td>
                <td className="border-b border-slate-800 p-4 text-sm"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}