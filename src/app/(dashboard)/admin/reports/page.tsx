import { BarChart3, Users, Clock, DollarSign, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react'

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Company-wide overview of HR metrics</p>
        </div>
        <div className="flex gap-3">
          <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Headcount</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">142</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12% from last year
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Avg. Attendance Rate</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">94.5%</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +2.1% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-16 h-16 text-rose-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Pending Leave Requests</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">18</h3>
          <p className="text-xs font-medium text-red-500 mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> Requires attention
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Monthly Payroll Run</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">$240.5k</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Stabilized
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fake Salary Distribution Chart */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Salary Distribution by Dept</h3>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2 h-48 mt-4 border-b border-slate-200 pb-2">
            <div className="w-full bg-indigo-100 rounded-t-sm relative group hover:bg-indigo-200 transition-colors" style={{ height: '100%' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">$85k</div>
            </div>
            <div className="w-full bg-blue-100 rounded-t-sm relative group hover:bg-blue-200 transition-colors" style={{ height: '70%' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">$60k</div>
            </div>
            <div className="w-full bg-emerald-100 rounded-t-sm relative group hover:bg-emerald-200 transition-colors" style={{ height: '85%' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">$72k</div>
            </div>
            <div className="w-full bg-rose-100 rounded-t-sm relative group hover:bg-rose-200 transition-colors" style={{ height: '40%' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">$35k</div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-500 mt-4 px-2">
            <span>Engineering</span>
            <span>HR</span>
            <span>Design</span>
            <span>Support</span>
          </div>
        </div>

        {/* Fake Attendance Trends Chart */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Attendance Trends (Last 7 Days)</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col gap-4">
            {[
              { day: 'Mon', val: 98 },
              { day: 'Tue', val: 95 },
              { day: 'Wed', val: 97 },
              { day: 'Thu', val: 92 },
              { day: 'Fri', val: 88 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-medium text-slate-500 w-8">{item.day}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.val > 95 ? 'bg-emerald-400' : item.val > 90 ? 'bg-blue-400' : 'bg-yellow-400'}`} 
                    style={{ width: `${item.val}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-10 text-right">{item.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}