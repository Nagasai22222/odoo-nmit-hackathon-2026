import { prisma } from '@/lib/prisma'
import { Search, DollarSign, Edit2, TrendingUp, Download } from 'lucide-react'

export default async function AdminPayrollPage() {
  const payrolls = await prisma.payroll.findMany({
    include: {
      employee: {
        include: { user: true }
      }
    }
  })

  // Dummy data if DB is empty to show UI
  const displayPayrolls = payrolls.length > 0 ? payrolls : [
    { id: '1', baseSalary: 80000, allowances: 5000, deductions: 2000, netSalary: 83000, employee: { employeeId: 'EMP-001', user: { name: 'John Doe' } } },
    { id: '2', baseSalary: 60000, allowances: 3000, deductions: 1000, netSalary: 62000, employee: { employeeId: 'EMP-002', user: { name: 'Jane Smith' } } },
    { id: '3', baseSalary: 120000, allowances: 10000, deductions: 4000, netSalary: 126000, employee: { employeeId: 'EMP-003', user: { name: 'Michael Johnson' } } },
  ]

  const totalPayroll = displayPayrolls.reduce((sum, p: any) => sum + p.netSalary, 0)
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      
      {/* Header Row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payroll Control</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and update employee salary structures</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-indigo-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 border-b border-slate-200">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Monthly Payroll</p>
            <p className="text-2xl font-bold text-slate-900">${totalPayroll.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Average Net Salary</p>
            <p className="text-2xl font-bold text-slate-900">${Math.round(totalPayroll / displayPayrolls.length).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto p-6">
        <table className="w-full text-left border-collapse border border-slate-800 min-w-[800px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700">Employee ID</th>
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700">Name</th>
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700">Base Salary</th>
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700">Allowances</th>
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700">Deductions</th>
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700">Net Salary</th>
              <th className="border border-slate-800 p-4 text-sm font-semibold text-slate-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayPayrolls.map((record: any) => (
              <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="border border-slate-800 p-4 text-sm font-medium text-indigo-600">{record.employee.employeeId}</td>
                <td className="border border-slate-800 p-4 text-sm font-medium text-slate-900">{record.employee.user?.name}</td>
                <td className="border border-slate-800 p-4 text-sm text-slate-600">${record.baseSalary.toLocaleString()}</td>
                <td className="border border-slate-800 p-4 text-sm text-emerald-600">+${record.allowances.toLocaleString()}</td>
                <td className="border border-slate-800 p-4 text-sm text-red-500">-${record.deductions.toLocaleString()}</td>
                <td className="border border-slate-800 p-4 text-sm font-bold text-slate-900">${record.netSalary.toLocaleString()}</td>
                <td className="border border-slate-800 p-4 text-sm text-center">
                  <button className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded transition-colors shadow-sm font-medium text-xs">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}