import { ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, CalendarOff, CalendarDays } from 'lucide-react'

const myAttendanceRecords = [
  { id: 1, date: '28/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: 2, date: '29/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: 3, date: '30/10/2025', checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '00:00' },
  { id: 4, date: '31/10/2025', checkIn: '10:30', checkOut: '19:30', workHours: '09:00', extraHours: '00:00' },
]

export default function EmployeeAttendancePage() {
  const currentMonthDisplay = "22, October 2025" // As per wireframe

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      
      {/* Header Row */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900">Attendance</h2>
      </div>

      {/* Toolbar Row: Navigation & Stats */}
      <div className="flex flex-wrap items-center px-6 py-3 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2 mr-4">
          <button className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Oct
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Blocks */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg text-base font-bold text-slate-800 bg-slate-50 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          Count of days present <span className="ml-2 text-xl text-emerald-700">18</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg text-base font-bold text-slate-800 bg-slate-50 shadow-sm">
          <CalendarOff className="w-6 h-6 text-rose-500" />
          Leaves count <span className="ml-2 text-xl text-rose-700">2</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg text-base font-bold text-slate-800 bg-slate-50 shadow-sm">
          <CalendarDays className="w-6 h-6 text-indigo-500" />
          Total working days <span className="ml-2 text-xl text-indigo-700">22</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse border-2 border-black min-w-[700px]">
          <thead>
            {/* Super Header for Date */}
            <tr>
              <th className="border-b-2 border-r-2 border-black p-0"></th>
              <th colSpan={4} className="border-b-2 border-black p-5 font-bold text-slate-900 text-lg">
                {currentMonthDisplay}
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-slate-100">
              <th className="border-b-2 border-r-2 border-black p-5 text-base font-bold text-slate-900 w-1/5">Date</th>
              <th className="border-b-2 border-r-2 border-black p-5 text-base font-bold text-slate-900 w-1/5">Check In</th>
              <th className="border-b-2 border-r-2 border-black p-5 text-base font-bold text-slate-900 w-1/5">Check Out</th>
              <th className="border-b-2 border-r-2 border-black p-5 text-base font-bold text-slate-900 w-1/5">Work Hours</th>
              <th className="border-b-2 border-black p-5 text-base font-bold text-slate-900 w-1/5">Extra hours</th>
            </tr>
          </thead>
          <tbody>
            {myAttendanceRecords.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="border-b-2 border-r-2 border-black p-5 text-base font-bold text-slate-900">{record.date}</td>
                <td className="border-b-2 border-r-2 border-black p-5 text-base font-semibold text-slate-700">{record.checkIn}</td>
                <td className="border-b-2 border-r-2 border-black p-5 text-base font-semibold text-slate-700">{record.checkOut}</td>
                <td className="border-b-2 border-r-2 border-black p-5 text-base font-semibold text-slate-700">{record.workHours}</td>
                <td className="border-b-2 border-black p-5 text-base font-semibold text-slate-700">{record.extraHours}</td>
              </tr>
            ))}
            
            {/* Filler rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={`filler-${i}`}>
                <td className="border-b-2 border-r-2 border-black p-5 text-base h-16"></td>
                <td className="border-b-2 border-r-2 border-black p-5 text-base"></td>
                <td className="border-b-2 border-r-2 border-black p-5 text-base"></td>
                <td className="border-b-2 border-r-2 border-black p-5 text-base"></td>
                <td className="border-b-2 border-black p-5 text-base"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}