import { prisma } from '@/lib/prisma'
import { User as UserIcon, Plane } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const employees = await prisma.employee.findMany({
    include: { user: true }
  })

  // Dummy data if DB is empty
  const displayEmployees = employees.length > 0 ? employees : Array.from({ length: 9 }).map((_, i) => ({
    id: `dummy-${i}`,
    firstName: 'Employee',
    lastName: `Name ${i + 1}`,
    status: i % 3 === 0 ? 'PRESENT' : i % 3 === 1 ? 'ABSENT' : 'LEAVE'
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayEmployees.map((emp: any) => {
          // Determine status color and icon
          const isPresent = emp.status === 'PRESENT'
          const isLeave = emp.status === 'LEAVE'
          const isAbsent = emp.status === 'ABSENT' || !emp.status
          
          return (
            <Link 
              href={`/admin/employees/${emp.id}`}
              key={emp.id} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-colors cursor-pointer group relative block"
            >
              {/* Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                {isPresent && <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" title="Present" />}
                {isAbsent && <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" title="Absent" />}
                {isLeave && <div title="On Leave"><Plane className="w-4 h-4 text-indigo-400 rotate-45" /></div>}
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  <UserIcon className="w-10 h-10 text-slate-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {emp.employeeId || 'ID Not Set'}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}