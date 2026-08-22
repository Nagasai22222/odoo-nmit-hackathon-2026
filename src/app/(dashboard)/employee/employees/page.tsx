import { prisma } from '@/lib/prisma'
import { User } from 'lucide-react'

export default async function EmployeeDirectoryPage() {
  const employees = await prisma.employee.findMany({
    include: { user: true }
  })

  // Pad with dummy data if there are fewer than 12 employees to fill the screen nicely
  const displayEmployees = [...employees]
  if (displayEmployees.length < 12) {
    const currentLength = displayEmployees.length
    const dummyCount = 12 - currentLength
    for (let i = 0; i < dummyCount; i++) {
      displayEmployees.push({
        id: `dummy-${currentLength + i}`,
        firstName: 'Dummy',
        lastName: `Employee ${currentLength + i + 1}`,
        employeeId: `EMP-${(currentLength + i + 1).toString().padStart(3, '0')}`,
        status: i % 3 === 0 ? 'PRESENT' : i % 3 === 1 ? 'ABSENT' : 'LEAVE'
      } as any)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Actions */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Employee Directory</h2>
        
        <div className="flex space-x-3 items-center">
          <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold text-sm px-6 py-1.5 rounded transition-colors shadow-sm uppercase tracking-wide">
            NEW
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border border-slate-300 rounded-md pl-4 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Grid of Employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayEmployees.map((emp: any) => (
          <div 
            key={emp.id} 
            className="group block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all relative"
          >
            {/* Status Dot */}
            <div className="absolute top-4 right-4">
              {emp.status === 'PRESENT' && (
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" title="Present"></div>
              )}
              {emp.status === 'LEAVE' && (
                <div className="text-blue-500" title="On Leave">✈️</div>
              )}
              {emp.status === 'ABSENT' && (
                <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" title="Absent"></div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center mb-4 transition-transform overflow-hidden shadow-sm">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 transition-colors">
                {emp.user?.name || `${emp.firstName} ${emp.lastName}`}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{emp.employeeId || 'No ID'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
